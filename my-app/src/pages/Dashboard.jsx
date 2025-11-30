import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/dashboard.css"; 

// Icons
import { Search, Upload, Bell, User, Menu, FileText, Bookmark, TrendingUp } from "lucide-react";

// Components
import Sidebar from "../components/Sidebar";
import ResourceCard from "../components/ResourceCard";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  
  // ✅ NEW: Search State
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate(); 

  // Stats Data
  const [stats] = useState([
    { label: "Uploaded Notes", count: 24, change: "+3 this week", icon: FileText, color: "red" },
    { label: "Bookmarked", count: 156, change: "+12 this week", icon: Bookmark, color: "red" },
    { label: "Total Downloads", count: "2.4K", change: "+18% this month", icon: TrendingUp, color: "red" },
  ]);

  // Recent Uploads Data
  const [recentUploads] = useState([
    { id: 1, title: "Data Structures - Binary Trees", subject: "Computer Science", professor: "Prof. Anderson", fileType: "PDF", uploadTime: "2 hours ago", rating: 4.5, reviews: 23, downloads: 45 },
    { id: 2, title: "Calculus II - Integration Techniques", subject: "Mathematics", professor: "Dr. Martinez", fileType: "PPT", uploadTime: "5 hours ago", rating: 4.8, reviews: 42, downloads: 78 },
    { id: 3, title: "World History - Renaissance Era", subject: "History", professor: "Prof. Chen", fileType: "DOCX", uploadTime: "1 day ago", rating: 4.2, reviews: 18, downloads: 34 },
  ]);

  // Recent Downloads Data
  const [recentDownloads] = useState([
    { id: 4, title: "Physics I - Kinematics", subject: "Physics", professor: "Dr. Smith", fileType: "PDF", uploadTime: "30 min ago", rating: 4.6, reviews: 55, downloads: 120 },
    { id: 5, title: "Intro to Economics", subject: "Economics", professor: "Prof. Kim", fileType: "DOCX", uploadTime: "1 hour ago", rating: 4.1, reviews: 15, downloads: 22 },
  ]);

  useEffect(() => {
    const name = localStorage.getItem("userFullName");
    if (name) setFullName(name);
  }, []);

  // ✅ NEW: Handle Search Logic
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Navigate to search page and pass the query
      navigate('/search', { state: { query: searchTerm } });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search notes, subjects, teachers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
              <Upload size={18} /> Upload
            </button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        {/* Welcome */}
        <div className="welcome-section">
          <h2>Welcome back, {fullName || "Student"}!</h2>
          <p>Here's what's happening with your academic resources today.</p>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
             const Icon = stat.icon;
             return (
              <div className="stat-card" key={index}>
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="stat-number">{stat.count}</div>
                <div className="stat-change positive">{stat.change}</div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          
          {/* Recent Uploads */}
          <section className="content-section">
            <div className="section-header">
              <h3>Recent Uploads</h3>
              <Link to="/uploads" className="view-all">View all</Link>
            </div>
            <div className="uploads-list">
              {recentUploads.map((item) => (
                <ResourceCard key={item.id} data={item} />
              ))}
            </div>
          </section>

          {/* Recent Downloads */}
          <section className="content-section downloads-section">
            <div className="section-header">
              <h3>Recent Downloads</h3>
              <Link to="/downloads" className="view-all">View all</Link>
            </div>
            <div className="uploads-list">
              {recentDownloads.map((item) => (
                <ResourceCard key={item.id} data={item} />
              ))}
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
}