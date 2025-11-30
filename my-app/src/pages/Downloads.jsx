import React, { useState } from "react";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  Bookmark, 
  Folder, 
  Heart, 
  FileText, 
  Star, 
  Download, 
  Eye 
} from "lucide-react";

// Shared Components
import Sidebar from "../components/Sidebar";

// Styles
import "../styles/dashboard.css"; // Base layout
import "../styles/downloads.css"; // Page specific styles

export default function Downloads() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Stats Data matching your screenshot
  const stats = [
    { label: "Reviews Written", count: 5, icon: Bookmark, color: "red" },
    { label: "Folders", count: 5, icon: Folder, color: "yellow" },
    { label: "Added This Week", count: 0, icon: Heart, color: "green" },
  ];

  // Downloads Data
  const [downloads] = useState([
    { 
      id: 1, 
      title: "Math in Modern World - Methods of Data Collection", 
      description: "Comprehensive notes covering arrays, linked lists, trees, and sorting algorithms with examples",
      author: "Erica Galvez",
      date: "10/25/25",
      rating: 4.8,
      downloadCount: 201,
      uploadedBy: "Mark"
    },
    { 
      id: 2, 
      title: "Math in Modern World - Methods of Data Collection", 
      description: "Comprehensive notes covering arrays, linked lists, trees, and sorting algorithms with examples",
      author: "Erica Galvez",
      date: "10/25/25",
      rating: 4.8,
      downloadCount: 201,
      uploadedBy: "Mark"
    },
    { 
      id: 3, 
      title: "Math in Modern World - Methods of Data Collection", 
      description: "Comprehensive notes covering arrays, linked lists, trees, and sorting algorithms with examples",
      author: "Erica Galvez",
      date: "10/25/25",
      rating: 4.8,
      downloadCount: 201,
      uploadedBy: "Mark"
    },
    { 
      id: 4, 
      title: "Math in Modern World - Methods of Data Collection", 
      description: "Comprehensive notes covering arrays, linked lists, trees, and sorting algorithms with examples",
      author: "Erica Galvez",
      date: "10/25/25",
      rating: 4.8,
      downloadCount: 201,
      uploadedBy: "Mark"
    },
  ]);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">Downloads</h1>
          </div>
          <div className="header-right">
            <button className="upload-btn"><Upload size={18} /> Upload</button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="downloads-container">
          
          {/* 1. Stats Row */}
          <div className="stats-row">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div className="stat-card-download" key={index}>
                  <div className={`stat-icon-square ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="stat-info-download">
                    <h3>{stat.count}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Filter Bar */}
          <div className="downloads-toolbar">
            <div className="search-bar-download">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search downloads..." />
            </div>
            
            <div className="toolbar-right">
              <select className="subject-select">
                <option>All Subjects</option>
                <option>Math</option>
                <option>Science</option>
              </select>
              <button className="my-downloads-btn">My Downloads</button>
            </div>
          </div>

          {/* 3. Downloads Grid */}
          <div className="downloads-grid">
            {downloads.map((item) => (
              <div key={item.id} className="download-card-large">
                
                {/* File Icon + Title Block */}
                <div className="card-top">
                  <div className="file-icon-red">
                    <FileText size={24} />
                  </div>
                  <div className="card-header-text">
                    <h4>{item.title}</h4>
                    <p className="card-desc">{item.description}</p>
                  </div>
                </div>

                {/* Author & Stats Meta */}
                <div className="card-meta-row">
                  <div className="author-info">
                    <User size={14} />
                    <span>{item.author}</span>
                    <span className="dot">•</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="stats-info">
                    <span className="rating-badge">
                      <Star size={12} fill="#fbbf24" stroke="none" />
                      {item.rating}
                    </span>
                    <span className="download-count">
                      <Download size={12} />
                      {item.downloadCount}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="card-footer">
                  <div className="uploader-info">
                    <div className="uploader-avatar">
                      <User size={16} />
                    </div>
                    <span>Uploaded by {item.uploadedBy}</span>
                  </div>
                  <div className="card-buttons">
                    <button className="preview-btn">Preview</button>
                    <button className="download-action-btn">
                      <Download size={14} /> Downloads
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}