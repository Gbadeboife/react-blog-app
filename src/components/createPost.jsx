import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../features/categories/categoriesSlice";
import { selectUser } from "../features/user/userSlice";
import { setUser } from "../features/user/userSlice";

import { db } from "../firebase-config";
import {collection, addDoc, getDocs} from "firebase/firestore"

import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

function CreatePost(){
    const [errMessage, setErrMessage]= useState('')
    const [postTitle, setPostTitle]= useState('')
    const [postCateg, setPostCateg]= useState('')
    const [postContent, setPostContent]= useState('')
    const [query, setQuery]= useState('')
    const [isFocused, setIsFocused]= useState(false)
    const dispatch= useDispatch()
    const userCollectionRef= collection(db, 'users')
    const postsCollectionRef= collection(db, 'posts')
    const navigate= useNavigate()

    const user= useSelector(selectUser)
    const categories= useSelector(selectCategories)

    const setCategory= (e)=>{
        setPostCateg(e.target.value)
    }



    const getDate= ()=>{
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        const formattedDate = formatter.format(now);
        return formattedDate
    }

    const showError= (message)=>{
        setErrMessage(message)
        setTimeout(()=> setErrMessage(''), 3000)
    }   


    const createPost= async()=>{

        const fetchUser= async()=>{
            const data= await getDocs(userCollectionRef)
            const allUsers= data.docs.map((doc)=> ({...doc.data(),userId: doc.id}))
            const currentUser= allUsers.find((curUser)=>{
                return curUser.email === user.email
            })
            return currentUser
        }

        const uploadPost= async()=>{

            const post= {
                authorId: user.userId,
                title: postTitle,
                category: postCateg,
                content: postContent,
                likedBy: [],
                commentIds: [],
                views: 0,
                publishDate: getDate()
            }
            try{
                await addDoc(postsCollectionRef, post)
            } catch {
                showError('An error occurred, try again!')
            }

        }

        if(postTitle !== '' && postContent !== ''){
            if ('userId' in user){
                uploadPost()
            } else {
                try{
                    dispatch(setUser(await fetchUser()))
                    uploadPost()
                    navigate('/')
                } catch {
                    showError('An error occurred, try again!')
                }
            }
        } else {
            showError('Post title or content cannot be empty')
        }

        
    }
    
    return(
            <div className="create-post">
                <section className="post-title">
                    <input type="text" onChange={(e)=> setPostTitle(e.target.value)} placeholder="Write a catchy title..."/>
                </section>
                    

                <section className="select-categ">
                    <input type="text" placeholder="Select a category for your post" onChange={(e)=> setQuery(e.target.value)} onFocus={()=> setIsFocused(true)} value={postCateg}/>
                    {   
                        isFocused?

                        (<div className="categories">
                                {categories.filter((category)=>{
                                    return category.includes(query)
                                }).map((categ)=>{
                                    return <button key={categ} onClick={()=> {
                                        setPostCateg(categ)
                                        setIsFocused(false)
                                    }}>{categ}</button>
                                })}
                        </div>
                        )
                        :
                        null

                    }
                </section>
                        
                <section className="post-content">
                    <MDEditor
                        value={postContent}
                        onChange={setPostContent}
                        preview='edit'
                        height={400}
                    />
                </section>
                
                <button disabled={postTitle && postContent} onClick={createPost}>Post</button>
 
            </div>
    )

}

export default CreatePost