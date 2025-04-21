import React from "react"
import { useState, useEffect } from "react";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { Link } from "react-router-dom";


function PopularPosts({fetchAuthor}){
    const [popPosts, setPopPosts]= useState([])
    const posts= useSelector(selectAllPosts)


    useEffect(()=>{
        const topPosts = [...posts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)

        setPopPosts(topPosts)
    }, [])



    return(
        <section className="popular">
            <h1>Popular posts</h1>
            {
                popPosts.map((post, index)=>{


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
    )
}

export default PopularPosts