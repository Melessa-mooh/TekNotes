import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import {
  Search,
  Upload,
  Bell,
  User,
  Menu,
  FileText,
  Bookmark,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import ResourceCard from "../components/ResourceCard";
import ApiService from "../services/api";

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [fullName, setFullName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState([
    {
      label: "Uploaded Notes",
      count: 0,
      change: "show how many uploaded notes this week",
      icon: FileText,
      color: "red",
    },
    {
      label: "Bookmarked",
      count: 0,
      change: "show how many bookmarked notes this week",
      icon: Bookmark,
      color: "red",
    },
    {
      label: "Total Downloads",
      count: 0,
      change: "shows the total Downloaded notes this week",
      icon: TrendingUp,
      color: "red",
    },
  ]);

  const [recentUploads, setRecentUploads] = useState([]);
  const [recentDownloads, setRecentDownloads] = useState([]);

  const navigate = useNavigate();

  // ===== Load dashboard data from backend =====
  const loadDashboardData = async (userId) => {
    try {
      const data = await ApiService.getDashboardOverview(userId);

      setStats([
        {
          label: "Uploaded Notes",
          count: data.uploadedNotes ?? 0,
          change: "show how many uploaded notes this week",
          icon: FileText,
          color: "red",
        },
        {
          label: "Bookmarked",
          count: data.bookmarked ?? 0,
          change: "show how many bookmarked notes this week",
          icon: Bookmark,
          color: "red",
        },
        {
          label: "Total Downloads",
          count: data.totalDownloads ?? 0,
          change: "shows the total Downloaded notes this week",
          icon: TrendingUp,
          color: "red",
        },
      ]);

      setRecentUploads(data.recentUploads || []);
      setRecentDownloads(data.recentDownloads || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      alert("Failed to load dashboard data. Please try again.");
    }
  };

  // ===== Always pull name from MySQL via backend =====
  useEffect(() => {
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);
    const userId = parsed.id ?? parsed.userId;

    if (!userId) return;

    const init = async () => {
      try {
        // 1. Get latest user data from backend (MySQL)
        const userData = await ApiService.getUserProfile(userId);

        // try both firstName and first_name depending on your DTO
        const first =
          userData.firstName ||
          userData.first_name ||
          "";

        setFullName(first);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        alert("Failed to load user profile. Please try again.");
      }

      // 2. Load dashboard stats using same userId
      loadDashboardData(userId);
    };

    init();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate("/search", { state: { query: searchTerm } });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
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
            <button
              className="upload-btn"
              onClick={() => navigate("/uploads")}
            >
              <Upload size={18} /> Upload
            </button>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <button className="icon-btn">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Welcome */}
        <div className="welcome-section">
          <h2>Welcome back, {fullName || "Student"}!</h2>
          <p>Here's what's happening with your academic resources today.</p>
        </div>

        {/* Stats Grid */}
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
              <Link to="/uploads" className="view-all">
                View all
              </Link>
            </div>
            <div className="uploads-list">
              {recentUploads.length === 0 ? (
                <p className="empty-text">No recent uploads yet.</p>
              ) : (
                recentUploads.map((item) => (
                  <ResourceCard key={item.id} data={item} />
                ))
              )}
            </div>
          </section>

          {/* Recent Downloads */}
          <section className="content-section downloads-section">
            <div className="section-header">
              <h3>Recent Downloads</h3>
              <Link to="/downloads" className="view-all">
                View all
              </Link>
            </div>
            <div className="uploads-list">
              {recentDownloads.length === 0 ? (
                <p className="empty-text">No recent downloads yet.</p>
              ) : (
                recentDownloads.map((item) => (
                  <ResourceCard key={item.id} data={item} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}