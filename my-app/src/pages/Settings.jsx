import React, { useState } from "react";
import "../styles/dashboard.css"; 
import "../styles/settings.css"; 
import { Link, useNavigate } from "react-router-dom"; 

import Sidebar from "../components/Sidebar"; 

import {
  Upload,
  Menu, 
} from "lucide-react";

export default function Settings() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate(); 

  return (
    <div className="dashboard-container">
      
      <Sidebar isOpen={isSidebarOpen} /> 

      <main className="main-content">

        {/* --- HEADER WITH TITLE INSIDE --- */}
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-btn"
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
            >
              <Menu size={24} />
            </button>
            
            {/* Title moved here */}
            <div className="page-header-text" style={{ marginLeft: "10px" }}>
               <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" }}>Settings</h1>
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

        {/* Settings Page Content */}
        <div className="settings-page">
          
          {/* Removed the title/subtitle from here since it's now in the header */}

          {/* Profile Settings Card */}
          <Link to="/settings/profile" className="settings-card-link">
            <div className="settings-card">
              <div className="settings-icon">👤</div>
              <div>
                <h3>Profile Settings</h3>
                <p>Manage your profile and personal information</p>
              </div>
            </div>
          </Link>

          {/* Account Settings Card */}
          <Link to="/settings/account" className="settings-card-link">
            <div className="settings-card">
              <div className="settings-icon">🔒</div>
              <div>
                <h3>Account Settings</h3>
                <p>Email, password and security settings</p>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}