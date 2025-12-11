import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Menu } from "lucide-react";
import "../styles/dashboard.css";

export default function Header({ onMenuClick, showSearch = true }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        {showSearch && (
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notes, subjects, teachers..."
              onClick={() => navigate("/search")}
            />
          </div>
        )}
      </div>
      <div className="header-right">
        <button className="upload-btn" onClick={() => navigate("/uploads")}>
          <Upload size={18} /> Upload
        </button>
      </div>
    </header>
  );
}

