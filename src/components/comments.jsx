import React, {useState} from "react"

import { useSelector } from "react-redux"
import { selectAllComments } from "../features/allComments/allCommentsSlice"
import { selectUser } from "../features/user/userSlice";

import { db } from "../firebase-config";
import {collection, addDoc, getDocs} from "firebase/firestore"



function CommentList({commentIds}) {
    const allComments= useSelector(selectAllComments).comments
    const commentIdsSet = new Set(commentIds)
    const filteredComments = allComments.filter(comment => commentIdsSet.has(comment.commentId));

    
    return (
      <div className="comment-list">
        {filteredComments.map((comment, index) => (
        <div className="" key='index'>
            <img src="" alt="" />
            <div className="comm-content">
                <div className="">
                    <h3 className="">{comment.author}</h3>
                    <span className="">{comment.date}</span>
                </div>
                <p className="">{comment.content}</p>
            </div>
        </div>
        ))}
      </div>
    )
}



function CommentForm({showError}) {
    const [content, setContent] = useState("")
    const user= useSelector(selectUser)

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

    const uploadComment= async()=>{
        if('userId' in user){
            const commentsCollectionRef= collection(db, 'comments')
            const comment= {
                author: user.name,
                content: content,
                publishDate: getDate()
            }
            try{
                await addDoc(commentsCollectionRef, comment)
            } catch {
                showError('An error occurred, try again!')
            }
        } else {
            showError('Sign in to comment')
        }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      if (content.trim()) {
        uploadComment()
        setContent("")
      }
    }
    
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 mb-2"
      />
      <button type="submit">Post Comment</button>
    </form>
  )
}



function Comments({showError, commentIds}) {


    return (
        <div className="comments">
            <h2 className="">Comments</h2>
            <CommentList commentIds={commentIds}/>
            <CommentForm showError={showError}/>
        </div>
  )
}

export default Comments
