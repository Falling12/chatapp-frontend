import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  sidebarOpen: boolean
  incomingCall: string
}

const initialState: CounterState = {
  sidebarOpen: false,
  incomingCall: ''
}

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleSidebar, setIncomingCall } = appSlice.actions

export default appSlice.reducer