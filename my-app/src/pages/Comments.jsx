import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ApiService from "../services/api";
import Swal from 'sweetalert2';

// Components
import SearchCard from "../components/SearchCard";
import ResourceCommentsModal from "../components/ResourceCommentsModal"; 

// Styles
import "../styles/search.css";

export default function Comments() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // ✅ State for Modal
  const [selectedResourceForComments, setSelectedResourceForComments] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    loadResources();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await ApiService.getCurrentUser();
      if (user) setCurrentUserId(user.id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAllResources(); 
      setResources(data || []);
    } catch (error) {
      console.error("Failed to load resources:", error);
      Swal.fire("Error", "Could not load resources", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);

  // ✅ CLICK HANDLER
  const handleCommentClick = (resource) => {
    console.log("Opening modal for:", resource.title); // Debug log
    setSelectedResourceForComments(resource);
  };

  const handleRateClick = (data) => console.log("Rate clicked:", data.title);
  const handleDownload = async (data) => {
    try {
      await ApiService.downloadResource(data.id);
      Swal.fire("Success", "Download started!", "success");
    } catch (error) {
      Swal.fire("Error", "Download failed", "error");
    }
  };
  const handlePreview = (data) => window.open(`/resources/${data.id}`, '_blank');

  const filteredResources = resources.filter((file) => {
    const matchesSearch = file.title.toLowerCase().includes(searchQuery) || 
                          file.description?.toLowerCase().includes(searchQuery);
    const matchesSubject = selectedSubject === "All Subjects" || file.subject === selectedSubject || 
                          (file.courseCode && file.courseCode === selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h2>Search Resources</h2>
        <p>Find study materials from the whole community</p>
      </div>

      <div className="search-toolbar-wrapper">
        <div className="main-search-input">
          <Search size={20} className="search-icon-gray" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="dropdown-filters">
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                Filter by Subject
              </label>
              <select 
                className="filter-dropdown" 
                value={selectedSubject} 
                onChange={handleSubjectChange}
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
                <option value="All Subjects">All Subjects</option>
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
            {selectedSubject !== "All Subjects" && (
              <button
                onClick={() => handleSubjectChange({ target: { value: "All Subjects" } })}
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
      </div>

      <div className="search-results-grid">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredResources.length > 0 ? (
          filteredResources.map((file) => (
            <SearchCard 
              key={file.id} 
              data={file}
              onRate={handleRateClick}
              onDownload={handleDownload}
              onPreview={handlePreview}
              // ✅ PASS HANDLER DOWN
              onCommentClick={handleCommentClick} 
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className="no-results">
            <p>{selectedSubject === "All Subjects" ? "No resources found." : `No matching notes for "${selectedSubject}"`}</p>
          </div>
        )}
      </div>

      {/* ✅ MODAL RENDER LOGIC */}
      {selectedResourceForComments && (
        <ResourceCommentsModal
          isOpen={true}
          resourceId={selectedResourceForComments.id}
          resourceTitle={selectedResourceForComments.title}
          currentUserId={currentUserId}
          onClose={() => setSelectedResourceForComments(null)}
        />
      )}
    </div>
  );
}