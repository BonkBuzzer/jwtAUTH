import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userData: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload
            localStorage.setItem('userData', JSON.stringify(action.payload))
        },
        clearUser: (state) => {
            state.userData = null
            localStorage.removeItem('userData')
        },
        updateUser: (state, action) => {
            state.userData = { ...state.userData, ...action.payload }
            localStorage.setItem('userData', JSON.stringify(state.userData))
        },
    },
})

export const { setUser, clearUser, updateUser } = userSlice.actions

export default userSlice.reducer