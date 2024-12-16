import React, {useState, useEffect} from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { selectUser } from "../features/user/userSlice";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";


import Header from "./header";


function Stats({userPosts}){
    const sumLikes = (userPosts) => {
        return userPosts.reduce((sum, item) => sum + (item.likedBy?.length || 0), 0)
    }
 
    const sumComments = (userPosts) => {
         return userPosts.reduce((sum, item) => sum + (item.commentIds?.length || 0), 0)
    }
 
    const sumViews = (userPosts) => {
         return userPosts.reduce((sum, item) => sum + (item.views), 0)
    }

    return(
        <div className="stats">
            <div className="likes">
                <h5>{sumLikes}</h5>
                <p>Total post likes</p>
            </div>

            <div className="comments">
                <h5>{sumComments}</h5>
                <p>Total post comments</p>
            </div>

            <div className="views">
                <h5>{sumViews}</h5>
                <p>Total post views</p>
            </div>
        </div>
    )
}

function SideBar({setDisp}){
    return(
        <nav>
            <ul>
                <li onClick={()=>{setDisp('posts')}}>Posts</li>
                <li onClick={()=>{setDisp('drafts')}}>Drafts</li>
                <li onClick={()=>{setDisp('notis')}}>Notifications</li>
            </ul>
        </nav>
    )
}




function Dashboard({showError}){

    const [disp, setDisp]= useState('posts')
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
        const fetchUserPosts = async () => {
            try {
                setIsLoading(true);
                const posts = allPosts.filter((post) => {
                    return post.authorId === user.userId
                });
                setUserPosts(posts);
                setError(false);
            } catch (err) {
                showError("Failed to load posts");
                setUserPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, [allPosts]);


    const deletePost= async(id)=>{
        const docRef= doc(db, 'posts', id)
        
        try {
            await deleteDoc(docRef)
            console.log('Document successfully deleted');
        } catch {
            showError('Error deleting post')
        }
    }



    return(
        <>
            {user?
                (
                <section className="dashboard">

                    {isLoading && <p>Loading your posts...</p>}

                    {error && (
                        <p>Error, refresh page</p>
                    )}
                
                {!isLoading && !error && (
                    <>
                    <h1>Dashboard</h1>

                    <Stats userPosts={userPosts}/>
                    
                    <section>
                        <SideBar setDisp={setDisp}/>

                        <div className="posts-list">
                            {disp === 'posts' ? (
                                    <div className="posts">
                                        <div>
                                            <h4>Posts</h4>
                                            <select name="" id="" onChange={changeSortType}>
                                                <option value="recent">Most Recent</option>
                                                <option value="views">Most views</option>
                                                <option value="likes">Most likes</option>
                                                <option value="comments">Most comments</option>
                                            </select>
                                        </div>

                                        <div>
                                            {
                                                userPosts?.map((post, index)=>{
                                                    return(
                                                        <div className="dash-post" key={index}>
                                                            <div className="info">
                                                                <h5>{post.title}</h5>
                                                                <span>Published: {post.publishDate}</span>
                                                                <span>Edited: {post.editDate}</span>
                                                            </div>

                                                            <div className="stats">
                                                                <span>{post.likes}</span>
                                                                <span>{post.commentIds.length}</span>
                                                                <span>{post.views}</span>
                                                            </div>

                                                            <div className="options">
                                                                <Link to={`/post/${post.title}-${post.postId}/edit`}></Link>
                                                                <button onClick={()=>{deletePost(post.postId)}}></button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                ) 

                                :
                                
                                disp === 'notis' ? (
                                    <div className="notis">
                                        <h4>Notifications</h4>
                                        
                                    </div>
                                )

                                :(
                                    navigate('/')
                                )}
                            </div>
                        </section>
                    </>
                )}
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