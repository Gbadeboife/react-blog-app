import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { selectAllPosts } from "../features/allPosts/allPostsSlice";
import { selectUser } from "../features/user/userSlice";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { doc, updateDoc} from "firebase/firestore";



function EditPost(){
    const {postId}= useParams()
        
    const [isLoading, setIsLoading]= useState(true)
    const [loadError, setLoadError]= useEffect(false)
    const [post, setPost]=  useState({})
    const [author, setAuthor]=  useState({})
    const allPosts= useSelector(selectAllPosts)

    const [errMessage, setErrMessage]= useState('')
    const [postTitle, setPostTitle]= useState('')
    const [postCateg, setPostCateg]= useState('')
    const [postContent, setPostContent]= useState('')
    const [query, setQuery]= useState('')
    const [isFocused, setIsFocused]= useState(false)
    const dispatch= useDispatch()


    const user= useSelector(selectUser)

    const categories= useSelector(selectCategories)

    const setCategory= (e)=>{
        setPostCateg(e.target.value)
    }

    const showError= (message)=>{
        setErrMessage(message)
        setTimeout(()=> setErrMessage(''), 3000)
    }

    const inputRef= useRef(null)

    const handleUnfocus= () => {
        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    
    useEffect(()=>{
            const post= allPosts.find((post)=>{
                return post.postId === postId
            })
            setPost(post)
            setPostTitle(post.title)
            setPostCateg(post.category)
            setPostContent(post.content)
    }, [])
    

    
    const updatePost= async()=>{

        const postDoc= doc(db, 'posts', postId)

        const edits= {
            title: postTitle,
            category: postCateg,
            content: postContent,
        }

        try{
            await updateDoc(postDoc, edits)
        } catch {
            showError('An error occurred, try again!')
        }

    }

    return(
        <div>
            <section className="post-title">
                <input type="text" value={postTitle} onChange={(e)=> setPostTitle(e.target.value)} placeholder="Write a catchy title..."/>
            </section>
                

            <section className="select-categ">
                <input type="text" value={postCateg} onChange={(e)=> setQuery(e.target.value)} ref={inputRef} onFocus={()=> setIsFocused(true)} onBlur={()=> setIsFocused(false)}/>
                {   
                    isFocused?

                    (<div className="categories">
                            {categories.filter((category)=>{
                                return category.includes(query)
                            }).map((categ)=>{
                                return <p onClick={()=> {
                                    setPostCateg(categ)
                                    handleUnfocus()
                                }}>{categ}</p>
                            })}
                    </div>
                    )
                    :
                    null

                }
            </section>
                    
            <section className="post-content">
                <input type="text" value={postContent} onChange={(e)=> setPostContent(e.target.value)} placeholder="What do you want to talk about?"/>
            </section>

            <button onClick={updatePost}>Edit post</button>
            

        </div>
    )
}


export default EditPost