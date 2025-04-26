import React, {useState} from "react";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {collection, addDoc, getDocs} from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../features/user/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useDispatch,useSelector } from "react-redux";

import { selectUser } from "../features/user/userSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';



function SignUp({showError}){
    const [name, setName]= useState('')
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate= useNavigate()
    const userCollectionRef= collection(db, 'users')
    const dispatch= useDispatch()

    const redirect= ()=>{
        navigate('/')
    }

    if(Object.keys(useSelector(selectUser)).length !== 0){
        redirect()       
    }

    
    const checkIfUserExists= async(email)=>{
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

    const handleSubmit= (e)=>{
        e.preventDefault()



        const sendCreateRequest= async()=>{
            try{
                const user= {
                    name: name,
                    email: email,
                    date: new Date().toLocaleDateString(),
                    bio: ''
                }

                if(await checkIfUserExists(email)){
                    showError('User already signed up using another method')
                } else {
                    await createUserWithEmailAndPassword(auth, email, password)
                    
                    await addDoc(userCollectionRef, user)

                    localStorage.setItem('storedUser', JSON.stringify(user))
                    dispatch(setUser(user))
                    
                    navigate('/')
                }
                
            } catch(err){

                if(err.code=== 'auth/invalid-email'){
                    showError('Invalid Email')
                } else if (err.code=== 'auth/email-already-in-use'){
                    showError('This user already exists')
                } else {
                    showError('An error occured, try again')
                }
            }
        }
        
        if(name=== '' || email=== '' || password=== ''){
            showError('Fill all fields')
        } else if (password.length<8){
            showError('Password must be at least 8 characters')
        } else {
            sendCreateRequest()
        }
        
    }


    const googleAuth= async()=>{
        try{
            const provider= await new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const name = result.user.displayName;
            const email = result.user.email;

            const user= {
                name: name,
                username: name.split(" ").join(""),
                email: email,
                date: new Date().toLocaleDateString(),
                bio: ''
            }

            if(await checkIfUserExists(email)){
                console.log('user already exists')
            } else {
                await addDoc(userCollectionRef, user)
            }

            localStorage.setItem('storedUser', JSON.stringify(user))
            dispatch(setUser(user))
            navigate('/')

        } catch {
            showError('An error occured, try again')
        }
    }


    return(
        <div className="sign-up">
            <figure>
                <img src="" alt="" />
            </figure>

            <h1>Join the Community</h1>
            <button className="google-auth" onClick={googleAuth}><FontAwesomeIcon className="google" icon={faGoogle}/>Continue with Google</button>
            <span className="or">OR</span>
            
            <form action="">
                <input name='name' type="text" placeholder="Full name" onChange= {(e)=> setName(e.target.value)}/>
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
                <button type="submit" className="submit" onClick={handleSubmit}>Sign up</button>
                <p>Already have an account? <Link to='/signin'>Sign In</Link></p>
            </form>
        </div>
    )
}
export default SignUp