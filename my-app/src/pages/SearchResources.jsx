import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { 
  Search, 
  Upload, 
  Bell, 
  User, 
  Menu
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import SearchCard from "../components/SearchCard";
import ReviewModal from "../components/ReviewModal"; 
import ApiService from "../services/api"; 

import "../styles/dashboard.css"; 
import "../styles/search.css"; 

export default function SearchResources() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation Hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialQuery = location.state?.query || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Data State
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA & FIX UPLOADER NAME
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllResources();

        const resourcesArray = Array.isArray(data) ? data : [];
        
        // Map Backend Data -> Frontend UI Structure
        const mappedData = resourcesArray.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          subject: item.courseName || item.subject || "General", 
          author: item.teacherName || item.author || "Unknown Instructor", 
          fileType: item.fileType || "PDF", 
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently", 
          rating: item.averageRating || 0, 
          reviews: item.reviewCount || 0, 
          downloads: item.downloads || 0,
          
          // ✅ FIX: Check for the direct string first, then nested object
          uploadedBy: item.uploadedBy || item.user?.username || "Community"
        }));

        setAllResources(mappedData);
      } catch (error) {
        console.error("Error fetching resources:", error);
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: error.message || 'Could not load resources.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter Logic
  const filteredResources = allResources.filter((item) => {
    const query = searchQuery.toLowerCase();
    
    // Safety check
    const title = item.title ? item.title.toLowerCase() : "";
    const subject = item.subject ? item.subject.toLowerCase() : "";
    
    const matchesSearch = title.includes(query) || subject.includes(query);
    const matchesCategory = activeCategory === "All" || item.subject === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle Opening Rate Modal
  const handleRateClick = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // Submit Review to Backend
  const handleReviewSubmit = async (reviewData) => {
    if (!selectedResource) return;

    try {
      const storedUser = localStorage.getItem("teknotesUser");
      if (!storedUser) {
        Swal.fire({ icon: 'warning', title: 'Login Required', text: 'Please login to submit a review.' });
        navigate('/login');
        return;
      }
      const user = JSON.parse(storedUser);

      const payload = {
        userId: user.id || user.userId,
        resourceId: selectedResource.id, 
        rating: reviewData.rating,
        comment: reviewData.comment
      };

      await ApiService.createReview(payload);

      Swal.fire({
        icon: 'success',
        title: 'Review Submitted',
        timer: 1500,
        showConfirmButton: false
      });

      setIsModalOpen(false);
      setSelectedResource(null);

    } catch (err) {
      console.error("Submission Error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Could not save review.'
      });
    }
  };

  const handleDownload = (resource) => {
    Swal.fire({ 
        icon: 'success', 
        title: 'Download Started', 
        text: `Downloading ${resource.title}...`,
        timer: 2000,
        showConfirmButton: false
    });
  };

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
            <button className="upload-btn" onClick={() => navigate('/uploads')}>
                <Upload size={18} /> Upload
            </button>
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
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                <div className="spinner" style={{marginBottom: '10px'}}></div> 
                <p>Loading materials from database...</p>
             </div>
          ) : (
            <div className="search-results-grid">
              {filteredResources.length > 0 ? (
                filteredResources.map((item) => (
                  <SearchCard 
                    key={item.id} 
                    data={item} 
                    onRate={handleRateClick} 
                    onDownload={handleDownload}
                    onPreview={handlePreview} 
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                  <p>No resources found matching your search.</p>
                </div>
              )}
            </div>
          )}
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