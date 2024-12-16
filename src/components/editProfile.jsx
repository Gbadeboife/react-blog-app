import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db, storage } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCameraRetro, 
    faSave, 
    faTimes 
} from "@fortawesome/free-solid-svg-icons";

function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // State for form fields
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        website: "",
        profilePicture: "",
    });

    // State for image upload
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // Load current user data on component mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Fetch current user data from Redux or localStorage
                const currentUser = JSON.parse(localStorage.getItem('user'));
                
                if (currentUser) {
                    setProfileData({
                        name: currentUser.name || "",
                        username: currentUser.username || "",
                        email: currentUser.email || "",
                        bio: currentUser.bio || "",
                        location: currentUser.location || "",
                        website: currentUser.website || "",
                        profilePicture: currentUser.profilePicture || "",
                    });
                    setImagePreview(currentUser.profilePicture || "");
                }
            } catch (error) {
                console.error("Error loading user data", error);
            }
        };

        loadUserData();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload profile picture
    const uploadProfilePicture = async () => {
        if (!selectedImage) return profileData.profilePicture;

        try {
            const storageRef = ref(
                storage, 
                `profilePictures/${profileData.username}_${Date.now()}`
            );
            
            const snapshot = await uploadBytes(storageRef, selectedImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            return downloadURL;
        } catch (error) {
            console.error("Error uploading profile picture", error);
            return profileData.profilePicture;
        }
    };

    // Save profile changes
    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {
            // Upload profile picture if a new one is selected
            const profilePictureUrl = await uploadProfilePicture();

            // Update Firestore document
            const userDocRef = doc(db, 'users', profileData.username);
            await updateDoc(userDocRef, {
                ...profileData,
                profilePicture: profilePictureUrl
            });

            // Update local storage
            const updatedUser = {
                ...JSON.parse(localStorage.getItem('user')),
                ...profileData,
                profilePicture: profilePictureUrl
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Navigate back to profile page
            navigate(`/profile/${profileData.username}`);
        } catch (error) {
            console.error("Error saving profile", error);
            // Optionally show error message to user
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

            <div className="profile-picture-section">
                <figure className="profile-picture">
                    <img 
                        src={imagePreview || '/default-avatar.png'} 
                        alt="Profile" 
                    />
                    <button 
                        className="change-picture-btn"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FontAwesomeIcon icon={faCameraRetro} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </figure>
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

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input 
                        type="text" 
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        placeholder="Your current city"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input 
                        type="url" 
                        id="website"
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        placeholder="Your personal or professional website"
                    />
                </div>
            </form>
        </section>
    );
}

export default EditProfile;