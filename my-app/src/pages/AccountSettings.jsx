import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/accountSettings.css"; 

import {
  Search,
  Upload,
  Bell,
  User,
  Menu,
  FileText,
  Bookmark,
  ArrowLeft,
  Settings,
  Eye,      
  EyeOff  
} from "lucide-react";
import ApiService from "../services/api";
import Swal from "sweetalert2";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.id || user.userId;
    setCurrentUserId(userId);

    const loadUserData = async () => {
      try {
        const userData = await ApiService.getUserProfile(userId);
        setEmail(userData.email || "");
      } catch (error) {
        console.error("Error loading user data:", error);
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) setEmail(savedEmail);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire("Error", "Please fill in all password fields", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "New passwords do not match", "error");
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
            password: newPassword 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire("Error", "Failed to update password", "error");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">📚</div>
          <div className="logo-text">
            <h1>TekNotes</h1>
            <p>Academic Resources</p>
          </div>
        </div>

        <nav className="nav-section">
          <h3 className="nav-title">Navigation</h3>
          <Link to="/dashboard" className="nav-item">🏠 Dashboard</Link>
          <Link to="/materials" className="nav-item"><FileText size={18} /> My Materials</Link>
          <Link to="/downloads" className="nav-item"><Bookmark size={18} /> Downloads</Link>
          <Link to="/bookmarks" className="nav-item"><Bookmark size={18} /> Bookmarks</Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/settings" className="settings-link active">⚙️ Settings</Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn"><Menu size={24} /></button>
            <div className="page-header-text">
                <h1 style={{ fontSize: '20px', margin: 0 }}>Settings</h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Manage your account preferences and privacy settings</p>
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn-primary"><Upload size={18} /> Upload</button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="account-page-container">
            <button className="back-arrow-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} />
            </button>

            <div className="account-card">
                <div className="account-card-header">
                    <Settings size={28} color="#111827" strokeWidth={1.5} />
                    <h2>Account Settings</h2>
                </div>
                <p className="account-subtext">Manage your account information and security</p>

                <div className="account-form-group">
                    <label className="account-label">Email address</label>
                    <input 
                        type="text" 
                        value={email}
                        readOnly
                        className="account-input read-only"
                    />
                    <p className="input-helper">Used for login and notifications</p>
                </div>

                <hr className="account-divider" />

                <h4 className="section-title">Change password</h4>

                <div className="account-form-group">
                    <label className="account-label">Current password</label>
                    <div className="account-password-wrapper">
                        <input 
                            type={showCurrentPassword ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="account-input"
                        />
                        <button 
                            type="button"
                            className="account-password-toggle-btn"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="password-row">
                    {/* NEW PASSWORD */}
                    <div className="account-form-group">
                        <label className="account-label">New password</label>
                        <div className="account-password-wrapper">
                            <input 
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="account-input"
                            />
                            <button 
                                type="button"
                                className="account-password-toggle-btn"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="account-form-group">
                        <label className="account-label">Confirm password</label>
                        <div className="account-password-wrapper">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="account-input"
                            />
                            <button 
                                type="button"
                                className="account-password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="button-row">
                    <button className="update-btn" onClick={handleUpdatePassword}>
                        Update Password
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}