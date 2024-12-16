import React from "react";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CategorySelect from "./categorySelect";
import PopularPosts from "./popularPosts";
import SearchUsers from "./searchUsers";
import Header from "./header";

function SearchResults({fetchAuthor}){
    const {searchTerm}= useParams()
    
    const allPosts= useSelector(selectAllPosts).posts
    console.log(allPosts)
    const results= allPosts.filter((post)=>{
        return post.title.toLowerCase().includes(searchTerm.toLowerCase())
    })




    return(

        <>
        <section className="container">

        <section className="search-results">
            <h1 className="page-label">{`Search results for "${searchTerm}"`}</h1>
            {
                results.length> 0 ?

                    results?.map((post, index)=>{

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

                :

                <h3 className="no-posts">No posts found</h3>
            }
        </section>
        
        
        <div className="side-bar">
            <SearchUsers/>
        </div>

        </section>
        </>
    )
}

export default SearchResults