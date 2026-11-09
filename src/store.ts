import { configureStore } from '@reduxjs/toolkit'
import beamsReducer from './slices/beamsSlice'
import draftReducer from './slices/draftSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    beams: beamsReducer,
    draft: draftReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
