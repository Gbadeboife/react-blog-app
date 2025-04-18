import React, {useState} from "react";

import Header from "./header";
import CategorySelect from "./categorySelect";
import PopularPosts from "./popularPosts";
import Post from "./post"; 

import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import {useDispatch, useSelector} from 'react-redux'



function Home({fetchAuthor}){
    
    const posts= useSelector(selectAllPosts).posts
    const savePost= (postId)=>{
        console.log('saved')
    }


    return(
        <>
            <section className="container">
            <section className="home">
                <h1 className="page-label">Home</h1>
                {
                    posts?.map((post, index)=>(
                        <Post key={index} post={post}/>
                    ))
                }
            </section>

            <div className="side-bar">
                <CategorySelect/>
                <PopularPosts/>
            </div>
            </section>

        </>
    )
}

export default Home