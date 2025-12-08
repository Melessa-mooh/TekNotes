import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  MessageCircle,
  Download,
  Bookmark,
  LogOut,
  Settings,
  Home,
  Users
} from "lucide-react";
import "../styles/dashboard.css";

// IMPORT YOUR LOGO
import logo from "../assets/logotek.png"; 

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  const handleLogout = () => {
    localStorage.removeItem("userFullName");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo-section">
        {/* LOGO IMAGE */}
        <img src={logo} alt="TekNotes Logo" className="logo-image" />
        
        <div className="logo-text">
          <h1>TekNotes</h1>
          <p>Academic Resources</p>
        </div>
      </div>

      <nav className="nav-section">
        <h3 className="nav-title">Navigation</h3>
        
        <Link to="/dashboard" className={isActive("/dashboard")}>
          <Home size={18} />
          Dashboard
        </Link>
        
        <Link to="/materials" className={isActive("/materials")}>
          <FileText size={18} />
          My Materials
        </Link>
        
        <Link to="/reviews" className={isActive("/reviews")}>
          <MessageCircle size={18} />
          Reviews
        </Link>
        
        <Link to="/downloads" className={isActive("/downloads")}>
          <Download size={18} />
          Downloads
        </Link>
        
        <Link to="/bookmarks" className={isActive("/bookmarks")}>
          <Bookmark size={18} />
          Bookmarks
        </Link>
        
        <Link to="/groups" className={isActive("/groups")}>
          <Users size={18} />
          Study Groups
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={isActive("/settings") + " settings-link"}>
          <Settings size={18} />
          Settings
        </Link>

        <button 
          onClick={handleLogout} 
          className="nav-item"
          style={{ 
            background: "transparent", 
            border: "none", 
            cursor: "pointer", 
            width: "100%", 
            textAlign: "left",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "#dc2626"
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}