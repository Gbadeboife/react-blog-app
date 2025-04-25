import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../features/user/userSlice";


function EditProfile() {
    const navigate = useNavigate();
    const user= useSelector(selectUser)
    
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        website: "",
    });
    


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {
            const userDocRef = doc(db, 'users', profileData.username);
            await updateDoc(userDocRef, profileData);

            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user')),
                ...profileData
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            navigate(`/profile/${profileData.username}`);
        } catch (error) {
            console.error("Error saving profile", error);
        }
    };

    return (
        <section className="edit-profile">
            <div className="profile-header">
                <h1>Edit Profile</h1>
                <div className="profile-actions">
                    <button 
                        className="cancel-btn" 
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                    <button 
                        className="save-btn" 
                        onClick={handleSaveProfile}
                    >
                        <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                </div>
            </div>

            <form className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text" 
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        placeholder="Choose a unique username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea 
                        id="bio"
                        name="bio"
                        value={user.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        maxLength={250}
                    />
                </div>

            </form>
        </section>
    );
}

export default EditProfile;