import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { 
  Search, 
  Upload, 
  Menu
} from "lucide-react";
import Swal from 'sweetalert2';

import Sidebar from "../components/Sidebar";
import SearchCard from "../components/SearchCard";
import ReviewModal from "../components/ReviewModal"; 
import ResourceCommentsModal from "../components/ResourceCommentsModal"; 
import ApiService from "../services/api"; 

import "../styles/dashboard.css"; 
import "../styles/search.css"; 

export default function SearchResources() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialQuery = location.state?.query || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  
  const [selectedResourceForComments, setSelectedResourceForComments] = useState(null);

  // Data State
  const [allResources, setAllResources] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // FETCH DATA & FIX UPLOADER NAME
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user ID
        const storedUser = localStorage.getItem("teknotesUser");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUserId(user.id || user.userId);
        }

        setLoading(true);
        
        // Fetch resources
        const resourcesData = await ApiService.getAllResources();
        
        // Fetch courses
        const coursesData = await ApiService.getAllCourses();
        setAllCourses(coursesData);

        const resourcesArray = Array.isArray(resourcesData) ? resourcesData : [];
        
        // Map Backend Data -> Frontend UI Structure
        const mappedData = resourcesArray.map((item) => {
          const userId = storedUser ? JSON.parse(storedUser).id || JSON.parse(storedUser).userId : null;
          const isMyUpload = userId && (item.uploaderUserId === userId || item.uploaderId === userId);
          const uploaderDisplay = isMyUpload ? "You" : (item.uploaderName || item.uploadedBy || item.user?.username || "Community");
          
          return {
            id: item.id,
            title: item.title,
            description: item.description || item.tagDescription || "",
            subject: item.courseName || item.subject || "General", 
            author: item.teacherName || item.author || "Unknown Instructor", 
            fileType: item.fileType || "PDF", 
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently", 
            rating: item.averageRating || 0, 
            reviews: item.reviewCount || 0, 
            downloads: item.downloads || item.downloadCount || 0,
            uploadedBy: uploaderDisplay,
            uploaderUserId: item.uploaderUserId || item.uploaderId,
            // Add searchable fields
            courseCode: item.courseCode || "",
            department: item.department || "",
            tags: item.tagName || item.tags || "",
            courseName: item.courseName || item.subject || "",
            teacherName: item.teacherName || item.author || ""
          };
        });

        setAllResources(mappedData);
        
        // Extract unique courses that have resources
        const coursesWithResources = [...new Set(mappedData.map(item => item.courseName || "General"))];
        const availableCourseObjects = coursesData.filter(course => 
          coursesWithResources.includes(course.courseName)
        );
        // Also include "General" course if there are resources without proper course names
        if (coursesWithResources.includes("General")) {
          availableCourseObjects.push({ courseName: "General", courseId: 0 });
        }
        setAvailableCourses(availableCourseObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: error.message || 'Could not load data.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic - Search across multiple fields
  const filteredResources = allResources.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    
    // If search query is empty, only filter by category
    if (!query) {
      return activeCategory === "All" || item.courseName === activeCategory || 
             (item.courseCode && item.courseCode === activeCategory);
    }
    
    // Safety checks and normalize to lowercase
    const title = (item.title || "").toLowerCase();
    const courseName = (item.courseName || item.subject || "").toLowerCase();
    const instructor = (item.teacherName || item.author || "").toLowerCase();
    const department = (item.department || "").toLowerCase();
    const tags = (item.tags || item.tagName || "").toLowerCase();
    const courseCode = (item.courseCode || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    
    // Search across all fields
    const matchesSearch = 
      title.includes(query) ||
      courseName.includes(query) ||
      instructor.includes(query) ||
      department.includes(query) ||
      tags.includes(query) ||
      courseCode.includes(query) ||
      description.includes(query);
    
    const matchesCategory = activeCategory === "All" || 
                          item.courseName === activeCategory || 
                          (item.courseCode && item.courseCode === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Handle Opening Rate Modal
  const handleRateClick = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // ✅ 3. NEW HANDLER FOR COMMENT CLICK
  const handleCommentClick = (resource) => {
    console.log("Opening comments for:", resource.title);
    setSelectedResourceForComments(resource);
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

  const handleDownload = async (resource) => {
    try {
      const storedUser = localStorage.getItem("teknotesUser");
      if (!storedUser) {
        Swal.fire({
          icon: 'warning',
          title: 'Please Login',
          text: 'You need to login to download resources',
        });
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const userId = user.id || user.userId;
      const resourceId = resource.id;

      if (!userId || !resourceId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Missing user or resource information'
        });
        return;
      }

      await ApiService.createDownload(userId, resourceId);

      try {
        const fullResource = await ApiService.getResourceById(resourceId);
        if (fullResource.fileUrl) {
          const fileUrl = fullResource.fileUrl.startsWith('http') 
            ? fullResource.fileUrl 
            : `http://localhost:8080${fullResource.fileUrl}`;
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = resource.title || 'download';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (fileErr) {
        console.log("File download not available, but download tracked");
      }

      Swal.fire({ 
        icon: 'success', 
        title: 'Download Started', 
        text: `${resource.title} has been added to your downloads`,
        timer: 2000,
        showConfirmButton: false
      });

      window.dispatchEvent(new CustomEvent('downloadCompleted'));
    } catch (err) {
      console.error("Error downloading:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download resource: ' + err.message
      });
    }
  };

  const handlePreview = (item) => {
    const description = item.description || item.tagDescription || 'No description available.';
    Swal.fire({
      title: item.title,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Subject:</strong> ${item.subject || item.courseName || 'N/A'}</p>
          <p><strong>Professor:</strong> ${item.professor || item.teacherName || 'N/A'}</p>
          <p><strong>File Type:</strong> ${item.fileType || 'N/A'}</p>
          <p><strong>Description:</strong></p>
          <p style="margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
            ${description}
          </p>
          <p style="margin-top: 10px;"><strong>Rating:</strong> ${item.rating || 0} (${item.reviews || item.reviewCount || 0} reviews)</p>
          <p><strong>Downloads:</strong> ${item.downloads || item.downloadCount || 0}</p>
          <p style="margin-top: 10px; font-size: 12px; color: #64748b;"><strong>Uploaded by:</strong> ${item.uploadedBy || item.uploaderName || 'Unknown'}</p>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Close'
    });
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
          </div>
        </header>

        <div className="search-page-container">
          <div style={{ marginBottom: "20px" }}>
            {/* Search Bar */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by Course, Instructor, Department, Tags, or Course Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px 12px 45px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Filter by Course
                </label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">All Courses</option>
                  <option value="Appdev">Appdev</option>
                  <option value="TeckNo">TeckNo</option>
                  <option value="Networking1">Networking1</option>
                  <option value="Networking2">Networking2</option>
                  <option value="IM1">IM1</option>
                  <option value="IM2">IM2</option>
                  <option value="OOP1">OOP1</option>
                  <option value="OOP2">OOP2</option>
                  <option value="Electives">Electives</option>
                  <option value="Project Management">Project Management</option>
                </select>
              </div>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  style={{
                    padding: "10px 20px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "24px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Clear Filter
                </button>
              )}
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
                    
                    // ✅ 4. PASS THE HANDLER TO THE CARD
                    onCommentClick={handleCommentClick} 
                    
                    currentUserId={currentUserId}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                  <p>{activeCategory === "All" ? "No resources found matching your search." : `No matching notes for "${activeCategory}"`}</p>
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

        {/* ✅ 5. RENDER THE COMMENTS MODAL HERE */}
        {selectedResourceForComments && (
          <ResourceCommentsModal
            isOpen={true}
            resourceId={selectedResourceForComments.id}
            resourceTitle={selectedResourceForComments.title}
            currentUserId={currentUserId}
            onClose={() => setSelectedResourceForComments(null)}
          />
        )}
      </main>
    </div>
  );
}