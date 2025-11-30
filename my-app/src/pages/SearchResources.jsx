import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

// Styles
import "../styles/dashboard.css"; 
import "../styles/search.css"; 

export default function SearchResources() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // 1. Get query passed from Dashboard
  const location = useLocation();
  const initialQuery = location.state?.query || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // 2. Mock Data (Public Resources)
  const publicResources = [
    { 
      id: 101, 
      title: "Introduction to Psychology", 
      description: "Foundational concepts in behavioral science and cognitive processes.",
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
      description: "Study of the economy as a whole, including inflation and GDP.",
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
      description: "Understanding tree data structures and their algorithms.",
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

  // 3. Load Your LocalStorage Uploads on Mount
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

  // 4. Search & Filter Logic
  const filteredResources = allResources.filter((item) => {
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      item.title.toLowerCase().includes(query) || 
      item.subject.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query);

    const matchesCategory = activeCategory === "All" || item.subject === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Open Modal Handler
  const handleRateClick = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // ✅ THIS FUNCTION SAVES THE REVIEW SO IT APPEARS ON THE REVIEWS PAGE
  const handleReviewSubmit = (reviewData) => {
    if (!selectedResource) return;

    // 1. Create the new Review Object
    const newReview = {
      id: Date.now(), // Unique ID
      title: selectedResource.title,
      subject: selectedResource.subject,
      professor: selectedResource.author,
      content: reviewData.comment, // The comment from the modal
      rating: parseInt(reviewData.rating), // The stars
      likes: 0, 
      comments: 0,
      isMyReview: true, // Tag it as ours so we can delete it later
      reviewTime: "Just now"
    };

    // 2. Get existing reviews from LocalStorage
    const existingReviews = JSON.parse(localStorage.getItem("myReviews")) || [];

    // 3. Add to list (newest first)
    const updatedReviews = [newReview, ...existingReviews];

    // 4. Save back to LocalStorage (This is what the Reviews page reads!)
    localStorage.setItem("myReviews", JSON.stringify(updatedReviews));

    // 5. Notify and Close
    alert("Review submitted! You can see it on the Reviews page.");
    setIsModalOpen(false);
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
              <select 
                className="filter-dropdown"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="All">All Subjects</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Psychology">Psychology</option>
                <option value="Economics">Economics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
              
              <select className="filter-dropdown">
                <option>Teachers</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <div className="search-results-grid">
            {filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <SearchCard 
                  key={item.id} 
                  data={item} 
                  onRate={handleRateClick} 
                />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No resources found</h3>
                <p>Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>

        </div>

        {/* Review Modal */}
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