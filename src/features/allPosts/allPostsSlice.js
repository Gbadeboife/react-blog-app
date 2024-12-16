import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { db } from "../../firebase-config";
import {collection, getDocs} from 'firebase/firestore'



export const fetchPosts= createAsyncThunk('allPosts/fetchAllPosts', async ()=>{
    const postsCollectionRef= collection(db, 'posts')
    const data= await getDocs(postsCollectionRef)
    const payloadData= data.docs.map((doc)=>{
        return {...doc.data(), postId: doc.id}
    })
    console.log(payloadData)
    return payloadData
})  




const options= {



    deleteCommentId: (state, action)=>{
        return state.forEach((post)=>{
            if(action.payload.postId === post.postId){
                return{
                    ...post,
                    comments: post.comments.filter((commentId)=>{
                        return commentId !== action.payload.commentId
                    })
                }
            } else {
                return post
            }
        })
    },

    likePost: (state, action)=>{
            var userLiked= false

            for(let i=0; i<state.length; i++){
                if(state[i].postId === action.payload.postId){
                    for(let x=0; x<state[i].likedBy.length; x++){
                        if(action.payload.userId === state[i].likedBy[x]){
                            userLiked= true
                        }
                    }
                }
            }

            if (userLiked === true){

                const newPosts= state.map((post)=>{
                    if(post.postId === action.payload.postId){
                        return {
                            ...post,
                            likedBy: post.likedBy.filter((userId)=>{
                                return userId !==action.payload.userId
                            })
                        }
                    } else {
                        return post
                    }
                })

                return newPosts

            } else {

                const newPosts= state.map((post)=>{
                    if(post.postId === action.payload.postId){
                        return {
                            ...post,
                            likedBy: [
                                ...post.likedBy,
                                action.payload.userId
                            ]
                        }
                    } else {
                        return post
                    }
                })
            }

    },

    
}


const defPosts= [
    {
        title: 'the title',
        likedBy: ['a','b','c'],
        author: 'John doe',
        authorId: 'ssYzIRcxZV3cHfvv6H69',
        category: 'ejkrjr',
        commentIds: ['blehh'],
        publishDate: '5 Dec',
        content: 'Man this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehnMan this shit got me jarring mehn'
    },
    {
        title: 'the title',
        likedBy: ['a','b','c'],
        author: 'John doe',
        authorId: 'ssYzIRcxZV3cHfvv6H69',
        category: 'ejkrjr',
        commentIds: ['blehh'],
        publishDate: '8 Dec',
        content: 'Man this shit got me jarring mehn'
    }
]


const allPostsSlice= createSlice({
    name: 'allPosts',
    initialState: {
        posts: defPosts,
        loadState: {
            isLoading: false,
            isFailed: false
        }
    },
    reducers: options,
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loadState.isLoading = true;
                state.loadState.isFailed = false;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {

                state.posts= [...state.posts, ...action.payload]
                state.loadState.isLoading = false;
                state.loadState.isFailed = false;
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.loadState.isLoading = false;
                state.loadState.isFailed = true;
            });
    }
    
})

export default allPostsSlice.reducer


export const selectAllPosts= (state)=> state.allPosts