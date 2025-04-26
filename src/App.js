import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { fetchPosts } from './features/allPosts/allPostsSlice';
import { fetchComments } from './features/allComments/allCommentsSlice';
import { setUser } from './features/user/userSlice';
import { db } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';

import SignUp from './components/signUp';
import SignIn from './components/signIn';
import Home from './components/home';
import Header from './components/header';
import CreatePost from './components/createPost';
import PostPage from './components/postPage';
import ErrorMessage from './components/errorMessage';
import Dashboard from './components/dashboard';
import Comments from './components/comments';
import Profile from './components/profile';
import NotFound from './components/NotFound';
import EditProfile from './components/editProfile';


import { selectAllPosts } from './features/allPosts/allPostsSlice';
import { useSelector } from 'react-redux';
import SearchResults from './components/searchResults';
import CategPosts from './components/categPosts';



function App() {
  const dispatch= useDispatch()
  const [errMessage, setErrMessage]= useState('')
  
  useEffect(() => {
    const storedUser = localStorage.getItem('storedUser');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }

    dispatch(fetchPosts());
    dispatch(fetchComments());
  }, [])


  
  console.log(useSelector(selectAllPosts))


  const showError= (message)=>{
    setErrMessage(message)
    setTimeout(()=> setErrMessage(''), 3000)
  }

/*  const reloadSlices= ()=>{
    dispatch(fetchPosts())
    dispatch(fetchComments())
    
  }*/


  const fetchAuthor= async(id)=>{
    const userDocRef= doc(db, 'users', id)
    try{
        let user= await getDoc(userDocRef)
        return user.data()
    } catch {
        console.log('Error while loading author')   
    }
  }


  return (
    <Router>
        <ErrorMessage errMessage={errMessage} />
        <Routes>
          <Route path='/sign-in' element={<SignIn showError= {showError}/>}/>
          <Route path='/signup' element={<SignUp showError= {showError}/>}/>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Home fetchAuthor={fetchAuthor} showError= {showError}/>}/>
            <Route path='search/:searchTerm' element={<SearchResults fetchAuthor={fetchAuthor} showError= {showError}/>}/>
            <Route path='category/:category' element={<CategPosts fetchAuthor={fetchAuthor} />}/>
            <Route path='post/:postTitle' element={<PostPage fetchAuthor={fetchAuthor}/>}/>
            <Route path='create' element={<CreatePost/>}/>
            <Route path='dashboard' element={<Dashboard showError={showError}/>}/>
            <Route path='user/:username' element={<Profile/>}/>
            <Route path='settings/edit-profile' element={<EditProfile/>}/>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
    </Router>
  );
  
}


function Layout() {
  return (
      <>
          <Header />
          <Outlet /> 
      </>
  );
}

export default App;
