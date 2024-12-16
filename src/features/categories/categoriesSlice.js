import { createSlice } from "@reduxjs/toolkit";


const categState= [
    'General',
    'Lifestyle',
    'News',
    'Tech',
    'Travel',
    'Food',
    'Programming',
    'Reviews',
    'Opinion',
    'Ideas'
]

const categoriesSlice= createSlice({
    name: 'categories',
    initialState: categState,
})

export default categoriesSlice.reducer

export const selectCategories= (state)=> state.categories