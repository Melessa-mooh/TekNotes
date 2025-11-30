import React, { useState } from "react";
import { Menu, FileText, Star, BookOpen, Clock } from "lucide-react";

// Components
import Sidebar from "../components/Sidebar";

// Styles
import "../styles/bookmarks.css"; // Make sure your CSS is saved here
import "../styles/dashboard.css"; // We still need this for the main layout wrapper

export default function Bookmarks() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Mock Data matching your card structure
  const [bookmarks] = useState([
    {
      id: 1,
      title: "Data Structures - Binary Trees",
      subject: "Computer Science",
      professor: "Prof. Anderson",
      fileType: "PDF",
      rating: 4.8,
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Calculus II - Integration",
      subject: "Mathematics",
      professor: "Dr. Martinez",
      fileType: "PPT",
      rating: 4.5,
      date: "1 week ago"
    },
    {
      id: 3,
      title: "European History Notes",
      subject: "History",
      professor: "Prof. Chen",
      fileType: "DOCX",
      rating: 4.2,
      date: "3 hours ago"
    },
    {
      id: 4,
      title: "Physics - Quantum Mechanics",
      subject: "Physics",
      professor: "Dr. Richard",
      fileType: "PDF",
      rating: 4.9,
      date: "1 day ago"
    },
  ]);

  // Filter Logic
  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="dashboard-container">
      {/* Reusing the Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Layout Area */}
      <main className="main-content">
        
        {/* Mobile Menu Button (Hidden on Desktop via dashboard.css) */}
        <button 
          className="menu-btn" 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          style={{ margin: "20px 0 0 20px" }} // distinct styling for this page
        >
          <Menu size={24} />
        </button>

        {/* YOUR CSS STRUCTURE STARTS HERE */}
        <div className="bookmarks-container">
          
          {/* HEADER */}
          <div className="top-header">
            <h1>My Bookmarks</h1>
            <p>Access and manage your saved academic resources.</p>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stats-card">
              <div className="stat-icon">
                <BookOpen size={20} style={{ margin: "7px", color: "#555" }} />
              </div>
              <div>
                <h2>{bookmarks.length}</h2>
                <span style={{ fontSize: "12px", color: "#777" }}>Total Saved</span>
              </div>
            </div>
            
            <div className="stats-card">
              <div className="stat-icon">
                <Clock size={20} style={{ margin: "7px", color: "#555" }} />
              </div>
              <div>
                <h2>12</h2>
                <span style={{ fontSize: "12px", color: "#777" }}>Read Later</span>
              </div>
            </div>
          </div>

          {/* SEARCH ROW */}
          <div className="search-filter-row">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <select 
              className="subjects-dropdown"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="History">History</option>
              <option value="Physics">Physics</option>
            </select>

            <button className="my-bookmarks-btn">
              My List
            </button>
          </div>

          {/* CARDS GRID */}
          <div className="cards-grid">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((item) => (
                <div key={item.id} className="bookmark-card">
                  <div className="bookmark-icon">
                    <FileText />
                  </div>
                  
                  <div className="card-content" style={{ flex: 1 }}>
                    <h3>{item.title}</h3>
                    <p>{item.subject} • {item.professor}</p>
                    
                    <div className="card-meta">
                      <span className="file-type">{item.fileType}</span>
                      <span className="rating">⭐ {item.rating}</span>
                      <span style={{ marginLeft: "auto" }}>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#777", gridColumn: "span 2", textAlign: "center" }}>
                No bookmarks found matching your search.
              </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}