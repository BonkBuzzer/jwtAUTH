import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userData: JSON.parse(localStorage.getItem('userData')) || null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload
            localStorage.setItem('userData', JSON.stringify(action.payload))
        },
        logoutUser: (state) => {
            state.userData = null
            localStorage.removeItem('userData')
        },
        updateUser: (state, action) => {
            state.userData = { ...state.userData, ...action.payload }
            localStorage.setItem('userData', JSON.stringify(state.userData))
        },
    },
})

export const { setUser, logoutUser, updateUser } = userSlice.actions

export default userSlice.reducer