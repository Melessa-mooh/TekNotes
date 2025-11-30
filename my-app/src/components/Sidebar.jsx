import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  MessageCircle,
  Download,
  Bookmark,
  Settings,
  Home
} from "lucide-react";
import "../styles/dashboard.css";

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  // Helper to determine if link is active
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo-section">
        <div className="logo-icon">📚</div>
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
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={isActive("/settings") + " settings-link"}>
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}