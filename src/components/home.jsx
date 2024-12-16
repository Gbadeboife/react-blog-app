import React, {useState} from "react";

import Header from "./header";
import CategorySelect from "./categorySelect";
import PopularPosts from "./popularPosts";


import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import {useDispatch, useSelector} from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { Link } from "react-router-dom";


function Home({fetchAuthor}){
    
    const posts= useSelector(selectAllPosts).posts
    
    console.log(posts)
    const savePost= (postId)=>{
        console.log('saved')
    }


    return(
        <>
            <section className="container">
            <section className="home">
                <h1 className="page-label">Home</h1>
                {
                    posts?.map((post, index)=>{

                        return(
                            <Link key={index} to={`/post/${post.title}`}>
                                <div className="post">
                                    <div className="top-row">
                                        <figure>
                                            <img src="" alt="" />
                                        </figure>

                                        <span className="name">{post.author}</span>
                                        
                                        <span className="date">{post.publishDate}</span>
                                    </div>

                                    <div className="post-info">
                                        <div className="post-text">
                                                <h2>{post.title}</h2>
                                                <p>{post.content.slice(0,150)}</p>
                                        </div>

                                        <figure className="post-img">
                                            <img src="" alt="" />
                                        </figure>

                                    </div>

                                    <div className="bottom-row">
                                            <span className= 'categ'><Link to={`category/${post.category}`}>{post.category}</Link></span>

                                            <span><FontAwesomeIcon icon={faHeart} /> {post.likedBy.length} Likes</span>
                                    </div>

                                </div>
                            </Link>

                        )
                    })
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