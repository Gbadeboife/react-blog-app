import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../features/user/userSlice";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";


function EditProfile() {
    const navigate = useNavigate();
    const user= useSelector(selectUser)
    console.log(user)
    const dispatch= useDispatch()
    const [profileData, setProfileData] = useState({});
    
    useEffect(() => {
        setProfileData({
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio
        });
    }, [user]);
    console.log(profileData)


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'email'){
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {
            const userDocRef = doc(db, 'users', user.userId);
            await updateDoc(userDocRef, profileData);

            
            const updatedUser = {
                ...user,
                ...profileData
            };
            
            dispatch(setUser({updatedUser}));
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
                        value={profileData.name}
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
                        value={profileData.username}
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
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea 
                        id="bio"
                        name="bio"
                        value={profileData.bio}
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