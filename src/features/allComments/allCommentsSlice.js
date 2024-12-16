import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { db } from "../../firebase-config";
import {collection, getDocs} from 'firebase/firestore'

const usersCollectionRef= collection(db, 'comments')
    

export const fetchComments= createAsyncThunk('allComments/fetchAllComments', async ()=>{
    const data= await getDocs(usersCollectionRef)
    const payloadData= data.docs.map((doc)=>{
        return {...doc.data(), postId: doc.id}
    })
    return payloadData
})  



const allCommentsSlice= createSlice({
    name: 'allComments',
    initialState: {
        comments: [],
        loadState: {
            isLoading: false,
            isFailed: false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loadState.isLoading = true;
                state.loadState.isFailed = false;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.loadState.isLoading = false;
                state.loadState.isFailed = false;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.loadState.isLoading = false;
                state.loadState.isFailed = true;
            });
    }
    
})

export default allCommentsSlice.reducer


export const selectAllComments= (state)=> state.allComments