import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { selectUser } from "../features/user/userSlice";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";




import Header from "./header";


function PostPage({ fetchAuthor }) {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { postTitle } = useParams();
    const allPosts = useSelector(selectAllPosts).posts;

    const user= useSelector(selectUser)

    useEffect(() => {
        const loadPost = async () => {
            try {
                const foundPost = allPosts.find((p) => 
                    p.title === postTitle
                )
                if (!foundPost) {
                    throw new Error('Post not found');
                }

                // Fetch author details
                const authorDetails = await fetchAuthor(foundPost.authorId)
                 


                // Increment view count in Firestore
                const postDocRef = doc(db, 'posts', foundPost.postId);
                await updateDoc(postDocRef, {
                    views: increment(1)
                });

                if(foundPost.likedBy.includes(user.userId)){
                    setIsLiked(true)
                }
                


                // Update component state
                setPost(foundPost);
                setAuthor(authorDetails);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading post:', error);
                setLoadError(true);
                setIsLoading(false);
            }
        };

        loadPost();
    }, [allPosts]);

    const handleLike = async (postId, userId) => {
        const postRef = doc(db, 'posts', postId);
        if(isLiked){
            setIsLiked(!isLiked);
            await updateDoc(postRef, {
                likedBy: arrayRemove(userId)
            });
        } else {
            setIsLiked(!isLiked);
            await updateDoc(postRef, {
                likedBy: arrayUnion(userId)
            })
        }
    }



    if (isLoading) {
        return (
            <>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading post...</p>
                </div>
            </>
        );
    }

    if (loadError) {
        return (
            <>
                <section className="error-page">
                    <h1>Post Not Found</h1>
                    <p>The post you're looking for might have been removed or is temporarily unavailable.</p>
                    <Link to="/" className="back-home-btn">Go Back Home</Link>
                </section>
            </>
        );
    }

    return (
            <section className="post-page">
                <article className="post-body">
                    <header className="post-header">

                        <h1>{post.title}</h1>

                        <Link to={`/category/${post.category}`}> 
                            {post.category}
                        </Link>

                        <figure className="post-image">
                            <img/>
                        </figure>

                        <div className="author-info">
                            <Link to={`/${author?.username}`}>
                                <figure className="author-avatar">
                                    <img/>
                                </figure>
                                <div className="author-details">
                                    <h5>{author?.name}</h5>
                                </div>
                            </Link>
                        </div>

                        <div className="post-metadata">
                            <span>{post.publishDate}</span>
                            <div className="post-stats">
                                <FontAwesomeIcon icon={faComment} /> {post.commentIds?.length || 0} Comments
                                <FontAwesomeIcon icon={faHeart} /> {post.likedBy?.length || 0} Comments
                            </div>
                        </div>
                    </header>


                    <div className="post-content">


                        <div className="post-text">
                            {post.content}
                        </div>

                        {/* Post Actions */}
                        <div className="post-actions">
                            <button 
                                onClick={handleLike} 
                                className={`like-btn ${isLiked ? 'liked' : ''}`}
                            >
                                <FontAwesomeIcon icon={faHeart} /> 
                                {post.likedBy?.length || 0} Likes
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}

                </article>


            </section>
        
    );
}

export default PostPage;