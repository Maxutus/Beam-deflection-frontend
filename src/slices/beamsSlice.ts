import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'
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
  beams: Beam[]
  feedBeam: Beam | null
  loading: boolean
  error: string | null
}

const initialState: BeamsState = {
  searchValue: '',
  beams: [],
  feedBeam: null,
  loading: false,
  error: null,
}

export const getBeamsList = createAsyncThunk<Beam[], void, { state: RootState; rejectValue: LoadError }>(
  'beams/getBeamsList',
  async (_, { getState, rejectWithValue }) => {
    const { beams, user } = getState()
    const maxDeflection = parseNumber(beams.searchValue)
    if (isPagesBuild) {
      return getMockBeams(maxDeflection)
    }

    try {
      const response = await api.beams.beamsList({ max_deflection: maxDeflection })
      return response.data.map(toBeam)
    } catch {
      return rejectWithValue({ message: 'Не удалось загрузить балки', guest: !user.isAuthenticated })
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBeamsList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBeamsList.fulfilled, (state, action) => {
        state.loading = false
        state.beams = action.payload
      })
      .addCase(getBeamsList.rejected, (state, action) => {
        state.loading = false
        if (action.payload?.guest) {
          state.beams = getMockBeams(parseNumber(state.searchValue))
          return
        }
        state.beams = []
        state.error = action.payload?.message ?? null
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
        state.loading = true
      })
      .addCase(deleteBeam.fulfilled, (state, action) => {
        state.loading = false
        state.beams = state.beams.filter((beam) => beam.id !== action.payload)
      })
      .addCase(deleteBeam.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? null
      })
      .addCase(setUser, (state) => {
        state.feedBeam = null
      })
      .addCase(resetUser, (state) => {
        state.feedBeam = null
      })
  },
})

export const { setSearchValue } = beamsSlice.actions
export default beamsSlice.reducer
