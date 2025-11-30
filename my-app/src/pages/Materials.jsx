import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu, 
  FileText, 
  Download, 
  Star,
  CheckCircle,
  File
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css"; 
import "../styles/materials.css"; 

export default function Materials() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Default Mock Data (This shows if you haven't uploaded anything yet)
  const defaultMaterials = [
    { 
      id: 1, 
      title: "Math in Modern World - Methods of Data Collection", 
      description: "Comprehensive notes covering arrays, linked lists, trees, and sorting algorithms with examples",
      instructor: "Erica Dabalos", 
      date: "10/25/25",
      rating: 4.8,
      downloadCount: 201,
      uploadedBy: "Mavis"
    },
    { 
      id: 2, 
      title: "Physics - Quantum Mechanics", 
      description: "Introduction to quantum theory and particle physics.",
      instructor: "Dr. Sheldon",
      date: "10/29/25",
      rating: 4.9,
      downloadCount: 150,
      uploadedBy: "Mavis"
    },
    { 
      id: 3, 
      title: "Introduction to Algorithms", 
      description: "Basics of algorithmic complexity and big O notation.",
      instructor: "Prof. Cormen",
      date: "11/02/25",
      rating: 4.5,
      downloadCount: 89,
      uploadedBy: "Mavis"
    },
    { 
      id: 4, 
      title: "World History - The Renaissance", 
      description: "Detailed overview of the cultural rebirth in Europe.",
      instructor: "Ms. History",
      date: "11/05/25",
      rating: 4.7,
      downloadCount: 120,
      uploadedBy: "Mavis"
    }
  ];

  // State to hold all materials (Default + Uploaded)
  const [materials, setMaterials] = useState(defaultMaterials);

  // ✅ LOAD UPLOADED DATA AUTOMATICALLY
  useEffect(() => {
    // 1. Get uploaded notes from local storage (if any exist)
    const savedNotes = JSON.parse(localStorage.getItem("myMaterials")) || [];
    
    // 2. Combine saved notes with default notes
    // We put 'savedNotes' first so your newest upload appears at the top
    setMaterials([...savedNotes, ...defaultMaterials]);
  }, []);

  // Calculate dynamic stats based on actual data length
  const stats = [
    { label: "Total Notes", count: materials.length, icon: File, color: "gray" },
    { label: "Download", count: 3, icon: Download, color: "gray" },
    { label: "Published", count: 190, icon: CheckCircle, color: "gray" },
  ];

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
            <div className="page-header-text">
              <h1>My Materials</h1>
              <p>Manage and track your uploaded study materials</p>
            </div>
          </div>
          <div className="header-right">
            {/* Link to Upload Page */}
            <Link to="/uploads">
                <button className="upload-btn-primary">
                <Upload size={18} /> Upload
                </button>
            </Link>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="materials-container">
          
          {/* 1. Stats Row */}
          <div className="materials-stats-row">
            {stats.map((stat, index) => (
              <div className="material-stat-card" key={index}>
                <div className="stat-content">
                  <h3>{stat.count}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Filter Bar */}
          <div className="materials-toolbar">
            <div className="search-bar-material">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search materials..." />
            </div>
            
            <div className="toolbar-right">
              <select className="subject-select">
                <option>All Subjects</option>
                <option>Math</option>
                <option>Science</option>
                <option>History</option>
              </select>
              <button className="my-notes-btn">My Notes</button>
            </div>
          </div>

          {/* 3. Materials Grid */}
          <div className="materials-grid">
            {materials.map((item) => (
              <div key={item.id} className="material-card">
                
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

                {/* Instructor & Date Row */}
                <div className="card-meta-row">
                  <div className="author-info">
                    <User size={14} />
                    <span>{item.instructor}</span>
                    <span className="dot">🗓️</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="stats-info">
                    <span className="rating-badge">
                      <Star size={12} fill="#fbbf24" stroke="none" />
                      {item.rating || "New"}
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
                       {/* Simple avatar placeholder */}
                       <div style={{width: '100%', height:'100%', background: '#ccc'}}></div>
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