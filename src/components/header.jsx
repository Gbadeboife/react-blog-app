import React, {useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

import { removeUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSlice";



function Header(){

    let isAuth
    const [menuOpen, setMenuOpen]= useState(false)
    const [searchOpen, setSearchOpen]= useState(false)
    const [searchTerm, setSearchTerm]= useState('')

    const searchRef= useRef(null)
    const menuRef = useRef(null)
    
    
    const dispatch= useDispatch()
    const user= useSelector(selectUser)
    
    const browserWidth = window.innerWidth


    if(Object.keys(user).length === 0){
        isAuth= false
    } else {
        isAuth= true

    }
    

    const checkIfClickedOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false)
        }
    }
  
    document.addEventListener('mousedown', checkIfClickedOutside);
  

    const toggleSearchBar= ()=>{
        if(browserWidth <= 700){
            if(searchOpen === false){
                searchRef.current.style.display= 'block'            
            } else if (searchOpen === true){
                searchRef.current.style.display= 'none'            
            }
            setSearchOpen(!searchOpen)

        } else {
            return
        }
    }    

    


    const navigate= useNavigate()

    const submitSearchTerm= (e)=>{
        e.preventDefault()

        if(searchTerm !== ''){
            navigate(`/search/${searchTerm}`)
        } else {
            return
        }
    }


    const signOut= ()=>{
        dispatch(removeUser())
        localStorage.removeItem('storedUser')
    }

    return(
        <nav className="header">

            <figure className="logo">
                <Link to='/'>
                    Bloggr
                </Link>
            </figure>


            <div className="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={toggleSearchBar} className="search-icon"/>
                <form action="" onSubmit={submitSearchTerm} ref={searchRef}>
                    {
                        browserWidth>700 || searchOpen?
                        (<input type="text" value={searchTerm} placeholder="Search for posts..." onChange={(e)=> setSearchTerm(e.target.value)}/>)
                        :
                        null
                    }
                    
                </form>
            </div>



            {
                isAuth?
                (
                    <div className="header-links">
                        <Link to='/create' className="create-post">Create Post</Link>
                        <figure onClick={()=> setMenuOpen(!menuOpen)} ref={menuRef}>
                            <img src="" alt="" />
                            
                            {
                                menuOpen?
                                (
                                    <div className="prof-menu">
                                        <ul>
                                            <li>
                                                <Link to={`/${user.name}`}>Profile</Link>
                                            </li>

                                            <li>
                                                <Link to='/dashboard'>Dashboard</Link>
                                            </li>

                                            <li>
                                                <Link to='/saved-posts'>Saved Posts</Link>
                                            </li>

                                            <li>
                                                <Link to='/settings/edit-profile'>Settings</Link>
                                            </li>

                                            <li>
                                                <button onClick={signOut} className="sign-out">Sign Out</button>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                :
                                null
                            }
                        </figure>
                    </div>
                )
                :
                (
                    <div className="auth">
                        <Link className="sign-in-btn" to='/sign-in'>Sign in</Link>
        
                        <Link className="sign-out-btn" to='/sign-up'>Sign up</Link>
                    </div>
                )
            }

            
        </nav>
    )
}

export default Header