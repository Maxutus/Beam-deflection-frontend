import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  login: string
  isAuthenticated: boolean
  error: string | null
}

const initialState: UserState = {
  login: '',
  isAuthenticated: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<string>) {
      state.login = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    resetUser(state) {
      state.login = ''
      state.isAuthenticated = false
      state.error = null
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setUser, resetUser, setError } = userSlice.actions
export default userSlice.reducer
