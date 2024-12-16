import React, {useState} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { auth, db } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import {collection, getDocs} from "firebase/firestore"
import { setUser } from "../features/user/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../features/user/userSlice";


function SignIn({showError}){
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate= useNavigate()
    const dispatch= useDispatch()
    const userCollectionRef= collection(db, 'users')

    /*
    const redirect= ()=>{
        navigate('/')
    }

    if(Object.keys(useSelector(selectUser)).length !== 0){
        redirect()       
    }
        */

    const fetchUser= async(email)=>{
        const data= await getDocs(userCollectionRef)
        const allUsers= data.docs.map((doc)=> ({...doc.data(),userId: doc.id}))
        const currentUser= allUsers.find((user)=>{
            return user.email === email
        })
        return currentUser
    }
    
    const togglePassVis = () => {
        setShowPassword((prevState) => !prevState);
    }

    const checkIfUserExists= async(email)=>{
        const data= await getDocs(userCollectionRef)
        const allUsers= data.docs.map((doc)=> ({...doc.data(),userId: doc.id}))
        const currentUser= allUsers.find((user)=>{
            return user.email === email
        })
        
        return currentUser

    }


    const handleSubmit= async(e)=>{
        e.preventDefault()


        const sendSignInRequest= async()=>{
            try{
                if(await checkIfUserExists(email)){
                    showError('User already signed up using another method')
                } else {
                    await signInWithEmailAndPassword(auth, email, password)
                    const user= await fetchUser(email)

                    localStorage.setItem('storedUser', JSON.stringify(user));
                    dispatch(setUser(user))
                    navigate('/')
                }
                
            } catch(err){
                if(err.code=== 'auth/invalid-email'){
                    showError('Invalid Email')
                } else if (err.code=== 'auth/invalid-credential'){
                    showError('Incorrect Email or Password')
                } else {
                    showError('Error, try again')
                }
            }
        }


        if(email=== '' || password=== ''){
            showError('Fill all fields')
        } else if (password.length<8){
            showError('Password must be at least 8 characters')
        } else {
            sendSignInRequest()
        }
        
    }

    const googleAuth= async()=>{
        try{
            const provider= await new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const email = result.user.email;

            const user= await fetchUser(email)

            localStorage.setItem('storedUser', JSON.stringify(user))
            dispatch(setUser(user))
            navigate('/')
            

        } catch {
            showError('An error occured, try again')
        }
    }

    return(
        <div className="sign-in">
            <figure>
                <img src="" alt="" />
            </figure>

            <h1>Welcome Back!</h1>
            <button className="google-auth" onClick={googleAuth}><FontAwesomeIcon className="google" icon={faGoogle}/>Continue with Google</button>
            <span className="or">OR</span>

            <form action="">
                <input name="email" type="email" placeholder="Email" onChange= {(e)=> setEmail(e.target.value)}/>
                <div>
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" onChange= {(e)=> setPassword(e.target.value)}/>
                    {
                        showPassword?
                        <FontAwesomeIcon className="hide" icon={faEyeSlash} onClick={togglePassVis}/>
                        :
                        <FontAwesomeIcon className="show" icon={faEye} onClick={togglePassVis}/>
                    }
                </div>
                <button type="submit" className='submit' onClick={handleSubmit}>Sign In</button>
                <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
            </form>

        </div>
    )
}

export default SignIn