import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';


import Post from "./post";

function Profile(){

    const {username}= useParams()
    const [user, setUser]= useState()
    const [posts, setPosts] = useState([])  // Change posts to state
    
    const allPosts= useSelector(selectAllPosts)


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userQuery = query(
                    collection(db, 'users'), 
                    where('username', '==', username)
                )
                
                const querySnapshot = await getDocs(userQuery);
                
                if (!querySnapshot.empty) {
                    // Get the first matching user document
                    const userDoc = querySnapshot.docs[0];
                    setUser({
                        userId: userDoc.id, 
                        ...userDoc.data()
                    });
                } else {
                    // Handle case where no user is found
                    setUser(null);
                    console.log('No user found with this username');
                }
            } catch (error) {
                console.error('Error while loading user:', error);
                setUser(null);
            }

        };
    

        fetchUser();
    }, [username])

    useEffect(() => {
        if (user) {
            const fetchUserPosts = () => {
                const userPosts = allPosts.filter((post) => {
                    return post.authorId === user.userId;
                });
                setPosts(userPosts)  // Set posts state instead of direct assignment
            };

            fetchUserPosts();
        }
    }, [user, allPosts]);




    return(
        <section className="profile">
            <figure>
                <span>{user?.name[0].toUpperCase()}</span>
            </figure>

            <div className="user-info">
                <h1>{user?.name}</h1>
                <h3>{user?.bio}</h3>
                <span>Joined on {user?.date}</span>
            </div>

            <div>
                {posts?.length > 0 && posts.map((post, index)=> (  // Remove extra parentheses, add null check
                    <Post key={index} post={post}/>
                ))}
            </div>
        </section>

    )
}

export default Profile