import React from "react";
import { Link } from "react-router-dom";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';


function Post({post, index}){ 
    return(
        <Link key={index} to={`/post/${post.title}`}>
            <div className="post">
                <div className="top-row">
                    {

                    post.authorImg? (
                        <figure>
                            <img src={post.authorImg} alt="" />
                        </figure>
                    ) : (
                        <div className="avatar">
                            {post.author?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <span className="name">{post.author}</span>
                    
                    <span className="date">{post.publishDate}</span>
                </div>

                <div className="post-info">
                    <div className="post-text">
                            <h2>{post.title}</h2>
                            <p>{post.content.slice(0,150)}</p>
                    </div>

                    {
                        post.image && 
                            <figure className="post-img">
                                <img src="" alt=""/>
                            </figure>
                    }
                </div>

                <div className="bottom-row">
                        <span className= 'categ'><Link to={`category/${post.category}`}>{post.category}</Link></span>

                        <span><FontAwesomeIcon icon={faHeart} /> {post.likedBy.length} Likes</span>
                </div>

            </div>
        </Link>
    )
}

export default Post