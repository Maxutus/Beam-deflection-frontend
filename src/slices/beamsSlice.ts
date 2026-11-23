import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api, startBeamFeedSession } from '../api'
import { type Beam, getMockBeams, getMockFeedBeam, parseNumber, toBeam } from '../modules/beamsApi'
import type { RootState } from '../store'
import { resetUser, setUser } from './userSlice'
import { isPagesBuild } from '../modules/deployment'

interface LoadError {
  message: string
  guest: boolean
}

interface BeamsState {
  searchValue: string
  appliedSearchValue: string
  beams: Beam[]
  currentPage: number
  totalPages: number
  total: number
  listLoading: boolean
  listError: string | null
  listRequestId: string | null
  feedBeam: Beam | null
  loading: boolean
  error: string | null
}

const initialState: BeamsState = {
  searchValue: '',
  appliedSearchValue: '',
  beams: [],
  currentPage: 1,
  totalPages: 0,
  total: 0,
  listLoading: false,
  listError: null,
  listRequestId: null,
  feedBeam: null,
  loading: false,
  error: null,
}

const beamsPerPage = 10

interface BeamPage {
  data: Beam[]
  page: number
  total: number
}

function getMockBeamPage(maxDeflection: number | undefined, page: number): BeamPage {
  const beams = getMockBeams(maxDeflection)
  const offset = (page - 1) * beamsPerPage
  return { data: beams.slice(offset, offset + beamsPerPage), total: beams.length, page }
}

export const getBeamsList = createAsyncThunk<BeamPage, void, { state: RootState; rejectValue: string }>(
  'beams/getBeamsList',
  async (_, { getState, rejectWithValue }) => {
    const { beams, user } = getState()
    const maxDeflection = parseNumber(beams.appliedSearchValue)
    if (isPagesBuild) {
      return getMockBeamPage(maxDeflection, beams.currentPage)
    }

    try {
      const response = await api.beams.beamsList({
        max_deflection: maxDeflection,
        page: beams.currentPage,
        limit: beamsPerPage,
      })
      const { data = [], page = beams.currentPage, total = 0 } = response.data
      return { data: data.map(toBeam), page, total }
    } catch {
      return user.isAuthenticated
        ? rejectWithValue('Не удалось загрузить балки')
        : getMockBeamPage(maxDeflection, 1)
    }
  },
)

export const getFeedBeam = createAsyncThunk<
  Beam,
  { id?: number; next?: boolean },
  { state: RootState; rejectValue: LoadError }
>('beams/getFeedBeam', async ({ id, next }, { getState, rejectWithValue }) => {
  if (isPagesBuild) {
    return getMockFeedBeam(id, next) ?? rejectWithValue({ message: 'Балка не найдена', guest: true })
  }

  try {
    if (id === undefined || next) {
      await startBeamFeedSession()
    }
    const response = await api.beams.feedList({ id, next })
    return toBeam(response.data)
  } catch {
    return rejectWithValue({ message: 'Балка не найдена', guest: !getState().user.isAuthenticated })
  }
})

export const likeBeam = createAsyncThunk<Beam, { id: number; like: number }, { rejectValue: string }>(
  'beams/likeBeam',
  async ({ id, like }, { rejectWithValue }) => {
    try {
      const response = await api.beams.likeCreate(id, { like })
      return toBeam(response.data)
    } catch {
      return rejectWithValue('Не удалось поставить лайк')
    }
  },
)

export const deleteBeam = createAsyncThunk<number, number, { rejectValue: string }>(
  'beams/deleteBeam',
  async (id, { rejectWithValue }) => {
    try {
      await api.beams.beamsDelete(id)
      return id
    } catch {
      return rejectWithValue('Не удалось удалить балку')
    }
  },
)

const beamsSlice = createSlice({
  name: 'beams',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload
    },
    applySearchValue(state) {
      state.appliedSearchValue = state.searchValue
      state.currentPage = 1
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBeamsList.pending, (state, action) => {
        state.listRequestId = action.meta.requestId
        state.listLoading = true
        state.listError = null
      })
      .addCase(getBeamsList.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return
        state.listLoading = false
        state.beams = action.payload.data
        state.total = action.payload.total
        state.totalPages = Math.ceil(state.total / beamsPerPage)
        state.currentPage = action.payload.page
      })
      .addCase(getBeamsList.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return
        state.listLoading = false
        state.beams = []
        state.total = 0
        state.totalPages = 0
        state.listError = action.payload ?? null
      })
      .addCase(getFeedBeam.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeedBeam.fulfilled, (state, action) => {
        state.loading = false
        state.feedBeam = action.payload
      })
      .addCase(getFeedBeam.rejected, (state, action) => {
        state.loading = false
        const mockBeam = action.payload?.guest ? getMockFeedBeam(action.meta.arg.id, action.meta.arg.next) : undefined
        if (mockBeam) {
          state.feedBeam = mockBeam
          return
        }
        state.feedBeam = null
        state.error = action.payload?.message ?? null
      })
      .addCase(likeBeam.pending, (state) => {
        state.loading = true
      })
      .addCase(likeBeam.fulfilled, (state, action) => {
        state.loading = false
        state.feedBeam = action.payload
        state.beams = state.beams.map((beam) => (beam.id === action.payload.id ? action.payload : beam))
      })
      .addCase(likeBeam.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? null
      })
      .addCase(deleteBeam.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(deleteBeam.fulfilled, (state, action) => {
        state.listLoading = false
        state.beams = state.beams.filter((beam) => beam.id !== action.payload)
        if (state.beams.length === 0 && state.currentPage > 1) state.currentPage--
      })
      .addCase(deleteBeam.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload ?? null
      })
      .addCase(setUser, (state) => {
        state.feedBeam = null
      })
      .addCase(resetUser, (state) => {
        state.feedBeam = null
        state.searchValue = ''
        state.appliedSearchValue = ''
        state.currentPage = 1
        state.listRequestId = null
      })
  },
})

export const { applySearchValue, setCurrentPage, setSearchValue } = beamsSlice.actions
export default beamsSlice.reducer
