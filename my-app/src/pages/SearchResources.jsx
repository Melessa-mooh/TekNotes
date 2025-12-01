import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import SearchCard from "../components/SearchCard";
import ReviewModal from "../components/ReviewModal"; 

import "../styles/dashboard.css"; 
import "../styles/search.css"; 

export default function SearchResources() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation Hooks
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Initialize navigation
  
  const initialQuery = location.state?.query || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Mock Data
  const publicResources = [
    { 
      id: 101, 
      title: "Introduction to Psychology", 
      description: "Foundational concepts in behavioral science.",
      subject: "Psychology", 
      author: "Dr. Freud", 
      fileType: "PDF", 
      date: "2 days ago", 
      rating: 4.5, 
      reviews: 12, 
      downloads: 150,
      uploadedBy: "Admin"
    },
    { 
      id: 102, 
      title: "Organic Chemistry Basics", 
      description: "Structures, bonding, and reactivity of organic molecules.",
      subject: "Chemistry", 
      author: "Prof. White", 
      fileType: "PPT", 
      date: "1 week ago", 
      rating: 4.8, 
      reviews: 45, 
      downloads: 320,
      uploadedBy: "Admin"
    },
    { 
      id: 103, 
      title: "Macroeconomics 101", 
      description: "Study of the economy as a whole.",
      subject: "Economics", 
      author: "Dr. Keynes", 
      fileType: "DOCX", 
      date: "3 days ago", 
      rating: 4.2, 
      reviews: 8, 
      downloads: 90,
      uploadedBy: "Admin"
    },
    { 
      id: 104, 
      title: "Data Structures - Binary Trees", 
      description: "Understanding tree data structures.",
      subject: "Computer Science", 
      author: "Prof. Anderson", 
      fileType: "PDF", 
      date: "2 hours ago", 
      rating: 4.5, 
      reviews: 23, 
      downloads: 45,
      uploadedBy: "Admin"
    },
  ];

  const [allResources, setAllResources] = useState(publicResources);

  useEffect(() => {
    const myUploads = JSON.parse(localStorage.getItem("myMaterials")) || [];
    const formattedUploads = myUploads.map(upload => ({
      id: upload.id,
      title: upload.title,
      description: upload.description,
      subject: upload.course || "General", 
      author: upload.instructor || "Unknown",
      fileType: "PDF", 
      date: upload.date,
      rating: upload.rating || 0,
      reviews: 0,
      downloads: upload.downloadCount || 0,
      uploadedBy: "Me"
    }));
    setAllResources([...formattedUploads, ...publicResources]);
  }, []);

  const filteredResources = allResources.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = item.title?.toLowerCase().includes(query) || item.subject?.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "All" || item.subject === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleRateClick = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = (reviewData) => {
    if (!selectedResource) return;
    const newReview = {
      id: Date.now(),
      title: selectedResource.title,
      subject: selectedResource.subject,
      professor: selectedResource.author,
      content: reviewData.comment,
      rating: parseInt(reviewData.rating),
      likes: 0, 
      comments: 0,
      isMyReview: true,
      reviewTime: "Just now"
    };
    const existingReviews = JSON.parse(localStorage.getItem("myReviews")) || [];
    localStorage.setItem("myReviews", JSON.stringify([newReview, ...existingReviews]));
    alert("Review submitted! You can see it on the Reviews page.");
    setIsModalOpen(false);
  };

  const handleDownload = (resource) => {
    const existingDownloads = JSON.parse(localStorage.getItem("myDownloads")) || [];
    const isAlreadyDownloaded = existingDownloads.some(item => item.id === resource.id);
    
    if (isAlreadyDownloaded) {
      alert("You have already downloaded this resource!");
      return;
    }

    const newDownload = {
        ...resource,
        downloadedAt: new Date().toLocaleDateString()
    };
    
    const updatedDownloads = [newDownload, ...existingDownloads];
    localStorage.setItem("myDownloads", JSON.stringify(updatedDownloads));
    
    alert(`"${resource.title}" has been added to your Downloads.`);
  };

  // ✅ Handle Preview Navigation
  const handlePreview = (item) => {
    navigate(`/preview/${item.id}`, { state: { file: item } });
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
            <div className="page-header-text">
              <h1>Search Resources</h1>
              <p>Find study materials from the whole community</p>
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn"><Upload size={18} /> Upload</button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="search-page-container">
          <div className="search-toolbar-wrapper">
            <div className="main-search-input">
              <Search size={20} className="search-icon-gray" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="dropdown-filters">
              <select className="filter-dropdown" onChange={(e) => setActiveCategory(e.target.value)}>
                <option value="All">All Subjects</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Psychology">Psychology</option>
              </select>
            </div>
          </div>

          <div className="search-results-grid">
            {filteredResources.map((item) => (
              <SearchCard 
                key={item.id} 
                data={item} 
                onRate={handleRateClick} 
                onDownload={handleDownload}
                onPreview={handlePreview} // ✅ Pass the preview handler to the card
              />
            ))}
          </div>
        </div>

        <ReviewModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
          resourceTitle={selectedResource?.title}
        />
      </main>
    </div>
  );
}