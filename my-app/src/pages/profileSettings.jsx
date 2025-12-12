import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/profileSettings.css";

// 1. ADDED: Import Sidebar
import Sidebar from "../components/Sidebar";

import {
  Search,
  Upload,
  Menu, // <-- Kept Menu for the toggle button
  FileText,
  Bookmark,
  Edit3,
} from "lucide-react";
import ApiService from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Mavis Izumi");
  const [email, setEmail] = useState("mavisizumi@gmail.com");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [studyPreferences, setStudyPreferences] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // 2. ADDED: State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false); 


  // Load saved data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.id || user.userId;
    setCurrentUserId(userId);

    // Load user data from backend
    const loadUserData = async () => {
      try {
        const userData = await ApiService.getUserProfile(userId);
        
        // Update text fields
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
        setFullName(`${userData.firstName || ""} ${userData.lastName || ""}`);
        setStudyPreferences(userData.studyPreferences || "");

        // 👇 THIS IS THE FIX FOR THE REFRESH ISSUE 👇
        // Check if the database sent back a profile picture
        if (userData.profilePic) {
            setProfilePic(userData.profilePic);
            // Sync it to local storage so other pages (like Materials) can see it too
            localStorage.setItem("userProfilePic", userData.profilePic);
        }

      } catch (error) {
        console.error("Error loading user data:", error);
        
        // Fallback to localStorage if API fails
        const savedFullName = localStorage.getItem("userFullName");
        const savedEmail = localStorage.getItem("userEmail");
        const savedFirstName = localStorage.getItem("userFirstName");
        const savedLastName = localStorage.getItem("userLastName");
        const savedProfilePic = localStorage.getItem("userProfilePic");
        const savedPreferences = localStorage.getItem("studyPreferences");

        if (savedFullName) setFullName(savedFullName);
        if (savedEmail) setEmail(savedEmail);
        if (savedFirstName) setFirstName(savedFirstName);
        if (savedLastName) setLastName(savedLastName);
        if (savedProfilePic) setProfilePic(savedProfilePic);
        if (savedPreferences) setStudyPreferences(savedPreferences);
      }
    };

    loadUserData();
  }, [navigate]);

  // Handle profile image upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
        localStorage.setItem("userProfilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save changes
  const handleSave = async () => {
    if (!currentUserId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${currentUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          studyPreferences: studyPreferences,
          // Sending the image to the backend
          profilePic: profilePic 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedFullName = `${firstName} ${lastName}`;
      setFullName(updatedFullName);
      setIsEditing(false);

      // Save to localStorage as backup/sync
      localStorage.setItem("userFullName", updatedFullName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userFirstName", firstName);
      localStorage.setItem("userLastName", lastName);
      localStorage.setItem("studyPreferences", studyPreferences);
      
      if (profilePic) {
        localStorage.setItem("userProfilePic", profilePic);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update profile",
      });
    }
  };

  return (
    <div className="dashboard-container">
      {/* 3. Replaced static sidebar with component */}
      <Sidebar isOpen={isSidebarOpen} />
      {/* // DELETED:
      // <aside className="sidebar">
      //   ... all static sidebar code ...
      // </aside>
      */}

      {/* MAIN CONTENT */}
      <main className="main-content">
     {/* --- HEADER --- */}
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-btn"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            
            {/* Title & Description moved INSIDE Header Left */}
            <div className="page-header-text" style={{ marginLeft: "15px" }}>
               <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" }}>Profile Settings</h1>
               <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Manage your profile and track your learning journey</p>
            </div>
          </div>

          <div className="header-right">
            <button 
                className="upload-btn"
                onClick={() => navigate("/uploads")}
            >
              <Upload size={18} /> Upload
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="profile-settings-container"> 
          <p className="settings-subtitle">
          </p>

          {/* Profile Header */}
          <div className="profile-header-card">
            <div className="profile-photo-wrapper">
              <img
                src={profilePic || "https://via.placeholder.com/100?text=Profile"}
                alt="profile"
                className="profile-photo"
              />
              {isEditing && (
                <>
                  <label htmlFor="upload-profile" className="camera-overlay">
                    <Edit3 size={20} />
                  </label>
                  <input
                    id="upload-profile"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="upload-profile-input"
                  />
                </>
              )}
            </div>

            <div className="profile-info">
              <h3>{fullName}</h3>
              <p>{email}</p>
              <p>Information Technology</p>
            </div>

            {!isEditing && (
              <button className="edit-photo-btn" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="profile-details-card">
            <div className="details-header">
              <h3>Profile Details</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit <Edit3 size={16} />
                </button>
              ) : null}
            </div>

            <p className="details-subtext">Update your personal details.</p>

            <h4 className="section-title">PERSONAL INFORMATION</h4>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={firstName}
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={lastName}
                disabled={!isEditing}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <h4 className="section-title" style={{ marginTop: "20px" }}>STUDY PREFERENCES</h4>

            <div className="form-group">
              <label>Study Preferences</label>
              <textarea
                value={studyPreferences}
                disabled={!isEditing}
                onChange={(e) => setStudyPreferences(e.target.value)}
                placeholder="Enter your study preferences (e.g., preferred subjects, study times, learning style, etc.)"
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "5px" }}>
                Share your study preferences to help us personalize your experience
              </p>
            </div>

            <div className="form-buttons">
              {isEditing && (
                <>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}