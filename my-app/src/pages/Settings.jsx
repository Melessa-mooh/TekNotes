import React, { useState } from "react";
import "../styles/dashboard.css"; 
import "../styles/settings.css"; 
import { Link, useNavigate } from "react-router-dom"; 

import Sidebar from "../components/Sidebar"; 

import {
  Search,
  Upload,
  Menu, 
  FileText,
  MessageCircle,
  Bookmark,
  Download 
} from "lucide-react";

export default function Settings() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate(); 

  return (
    <div className="dashboard-container">
      
      <Sidebar isOpen={isSidebarOpen} /> 

      <main className="main-content">

        <header className="header">
          <div className="header-left">
          
            <button 
              className="menu-btn"
              onClick={() => setSidebarOpen(!isSidebarOpen)} // <-- Toggles the sidebar state
            >
              <Menu size={24} />
            </button>
            <div className="search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search notes, subjects, teachers..." />
            </div>
          </div>

          <div className="header-right">
           
            <button 
                className="upload-btn"
                onClick={() => navigate("/uploads")}
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </header>

        {/* Settings Page Content */}
        <div className="settings-page">
          <h2 className="settings-title">Settings</h2>
          <p className="settings-subtitle">
            Manage your profile and track your learning journey
          </p>

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