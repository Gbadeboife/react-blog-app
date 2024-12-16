import React, {useState, useEffect} from "react";


import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import { auth, db } from "../firebase-config";
import {collection, getDocs} from "firebase/firestore"


function SearchUsers() {
    const { searchTerm } = useParams();
    const userCollectionRef= collection(db, 'users')
    const [loading, setIsLoading]= useState(true)
    let results
    
    useEffect(()=>{
        const fetchAllUsers= async()=>{
            try{
                const data= await getDocs(userCollectionRef)
                const allUsers= data.docs.map((doc)=> ({...doc.data(),userId: doc.id}))

                results = allUsers.filter((user) => {
                    return (
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                })
            } catch(error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAllUsers()
    }, [])

    


    return (

            <section className="user-search">
                <h1>Users related to search</h1>
                {
                    results?.length > 0 ?
                        results?.map((user, index) => {
                            return (
                                <Link key={index} to={`/${user.username}`}>
                                    <div className="user-card">
                                            <figure>
                                                <img 
                                                />
                                            </figure>

                                            <div className="user-info">
                                                <span className="name">{user.name}</span>
                                                <span className="username">@{user.username}</span>
                                            </div>
                                    </div>
                                </Link>
                            );
                        })
                    :
                    <h3>No users found</h3>
                }
                </section>

    );
}

export default SearchUsers;