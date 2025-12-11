import React, { useState } from "react";
import "../styles/dashboard.css"; 
import "../styles/settings.css"; 
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate (for future use)

import Sidebar from "../components/Sidebar"; // <-- Reusable Sidebar component imported

import {
  Search,
  Upload,
  Bell,
  User,
  Menu, // <-- Needed for the toggle button in the header
  FileText,
  MessageCircle,
  Bookmark,
  Download 
} from "lucide-react";

export default function Settings() {
  // State to manage the open/close status of the sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate(); // Added for consistency with other pages (e.g., for Upload button)

  return (
    <div className="dashboard-container">
      
      {/* 1. Sidebar Component */}
      {/* It uses the isSidebarOpen state to control its appearance */}
      <Sidebar isOpen={isSidebarOpen} /> 

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            {/* 2. Menu Button to Toggle Sidebar */}
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
            {/* Example: Using useNavigate for the Upload button */}
            <button 
                className="upload-btn"
                onClick={() => navigate("/uploads")}
            >
              <Upload size={18} />
              Upload
            </button>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <button className="icon-btn">
              <User size={20} />
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