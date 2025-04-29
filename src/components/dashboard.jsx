import React, {useState, useEffect} from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { selectUser } from "../features/user/userSlice";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

import Header from "./header";


function Stats({userPosts}){
    const sumLikes = () => {
        return userPosts.reduce((sum, item) => sum + (item.likedBy?.length || 0), 0)
    }
 
    const sumComments = () => {
         return userPosts.reduce((sum, item) => sum + (item.commentIds?.length || 0), 0)
    }
 
    const sumViews = () => {
         return userPosts.reduce((sum, item) => sum + (item.views), 0)
    }
    console.log(sumViews())

    return(
        <div className="stats">
            <div className="likes">
                <h5>{sumLikes()}</h5>
                <p>Total post likes</p>
            </div>

            <div className="comments">
                <h5>{sumComments()}</h5>
                <p>Total post comments</p>
            </div>

            <div className="views">
                <h5>{sumViews()}</h5>
                <p>Total post views</p>
            </div>
        </div>
    )
}



function Dashboard({showError}){

    const [userPosts,setUserPosts]= useState([])
    const [sortBy, setSortBy]= useState('recent')

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const allPosts= useSelector(selectAllPosts)
    const user= useSelector(selectUser)
    const navigate= useNavigate()

    const changeSortType= (e)=>{
        setSortBy(e.target.value)
    }

    useEffect(() => {
        const sortPosts = () => {
            if (sortBy === 'recent') {
                return [...userPosts].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            } else if (sortBy === 'views') {
                return [...userPosts].sort((a, b) => b.views - a.views);
            } else if (sortBy === 'likes') {
                return [...userPosts].sort((a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0));
            } else if (sortBy === 'comments') {
                return [...userPosts].sort((a, b) => (b.commentIds?.length || 0) - (a.commentIds?.length || 0));
            }
            return userPosts;
        };

        setUserPosts(sortPosts());
    }, [sortBy])

    useEffect(() => {
        const fetchUserPosts = () => {
            if (!user) {
                setUserPosts([]);
                setError(false);
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            const posts = allPosts.filter((post) => post.authorId === user.userId);
            
            if (!posts) {
                showError("Failed to load posts");
                setError(true);
                setUserPosts([]);
            } else {
                setUserPosts(posts);
                setError(false);
            }
            setIsLoading(false);
        };

        fetchUserPosts();
    }, [user, allPosts, showError]);


    const deletePost= async(id)=>{
        const docRef= doc(db, 'posts', id)
        
        try {
            await deleteDoc(docRef)
            console.log('Document successfully deleted');
        } catch {
            showError('Error deleting post')
        }
    }

    console.log(userPosts)

    return(
        <>
            {user?
                (
                <section className="container">
                <section className="dashboard">
                    <h1>Dashboard</h1>

                    {isLoading && (<p>Loading your posts...</p>)}

                    {error && (
                        <p>Error, refresh page</p>
                    )}
                
                {!isLoading && !error && (
                    <div className="dashboard-content">

                        <Stats userPosts={userPosts}/>
                        
                        <section className="posts-list">

                            <div >
                                {(
                                        <div className="posts">
                                            <form>
                                                <h4>Posts</h4>
                                                <select name="" id="" onChange={changeSortType}>
                                                    <option value="recent">Most Recent</option>
                                                    <option value="views">Most views</option>
                                                    <option value="likes">Most likes</option>
                                                    <option value="comments">Most comments</option>
                                                </select>
                                            </form>

                                            <>
                                                {
                                                    userPosts?.map((post, index)=>(
                                                            <div className="dash-post" key={index}>
                                                                <div className="info">
                                                                    <Link to={`/post/${post.title}`}>
                                                                        <h5>{post.title}</h5>
                                                                    </Link>
                                                                    <span><strong>Published:</strong> {post.publishDate}</span>
                                                                    {post.edited && <span><strong>Edited:</strong> {post.editDate}</span>}
                                                                </div>

                                                                <div className="stats">
                                                                    <span>
                                                                        <FontAwesomeIcon icon={faHeart} />
                                                                        <span>{post.likedBy?.length || 0}</span>    
                                                                    </span>

                                                                    <span>
                                                                        <FontAwesomeIcon icon={faComment} />
                                                                        <span>{post.commentIds.length || 0}</span>
                                                                    </span>
                                                                    
                                                                    <span>
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                        <span>{post.views || 0}</span>
                                                                    </span>
                                                                </div>

                                                                <div className="options">
                                                                    <Link to={`/post/${post.title}-${post.postId}/edit`}>Edit</Link>
                                                                    <button onClick={()=>{deletePost(post.postId)}}>Delete</button>
                                                                </div>
                                                            </div>
                                                        
                                                    ))
                                                }
                                            </>
                                        </div>
                                    ) 
                                }
                            </div>
                        </section>
                    </div>
                )}
            </section>
            </section>
            )

            :

            (
                <div className="">
                    <p>Sign in to view your dashboard</p>
                    <Link to='/signIn'>
                        Sign In
                    </Link>
                </div>
            )
        }
        </>)
}

export default Dashboard