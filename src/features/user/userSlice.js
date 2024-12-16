import { createSlice } from "@reduxjs/toolkit";

const userSlice= createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUser: (state, action)=>{
            return action.payload
        },
        removeUser: (state, action)=>{
            return {}
        }
    }
})

export const {
    setUser,
    removeUser
}= userSlice.actions

export default userSlice.reducer

export const selectUser= (state)=> state.user


