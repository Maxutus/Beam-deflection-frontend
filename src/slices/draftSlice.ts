import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { api } from '../api'
import { type Beam, toBeam } from '../modules/beamsApi'

interface DraftState {
  draft: Beam | null
  loading: boolean
  error: string | null
}

const initialState: DraftState = {
  draft: null,
  loading: false,
  error: null,
}

export const getDraft = createAsyncThunk<Beam | null, void, { rejectValue: string }>(
  'draft/getDraft',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.beams.draftList()
      return toBeam(response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      return rejectWithValue('Не удалось загрузить черновик')
    }
  },
)

export const createDraft = createAsyncThunk<Beam, { name: string; image: File; video: File }, { rejectValue: string }>(
  'draft/createDraft',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.beams.beamsCreate(data)
      return toBeam(response.data)
    } catch {
      return rejectWithValue('Не удалось создать черновик')
    }
  },
)

export const publishDraft = createAsyncThunk<
  Beam,
  { description: string; load: number; deflection: number },
  { rejectValue: string }
>('draft/publishDraft', async (data, { rejectWithValue }) => {
  try {
    const response = await api.beams.draftPublishUpdate(data)
    return toBeam(response.data)
  } catch {
    return rejectWithValue('Не удалось опубликовать балку')
  }
})

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDraft.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDraft.fulfilled, (state, action) => {
        state.loading = false
        state.draft = action.payload
      })
      .addCase(getDraft.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? null
      })
      .addCase(createDraft.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.loading = false
        state.draft = action.payload
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? null
      })
      .addCase(publishDraft.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(publishDraft.fulfilled, (state) => {
        state.loading = false
        state.draft = null
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? null
      })
  },
})

export default draftSlice.reducer
