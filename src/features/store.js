import { configureStore } from "@reduxjs/toolkit";
import allPostsReducer from './allPosts/allPostsSlice'
import allCommentsReducer from './allComments/allCommentsSlice'
import userReducer from './user/userSlice'
import categoriesReducer from './categories/categoriesSlice'


export const store= configureStore({
    reducer: {
        allPosts: allPostsReducer,
        allComments: allCommentsReducer,
        user: userReducer,
        categories: categoriesReducer
    }
})

