import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  User, 
  Menu, 
  ArrowLeft, 
  Download, 
  ThumbsUp, 
  ThumbsDown,
  Flag,
  Share2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/resources.css"; 

export default function FilePreview() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fileData = location.state?.file;

  if (!fileData) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="main-content">
          <div className="preview-error">
            <h2>No file selected</h2>
            <button onClick={() => navigate('/materials')}>Go to Materials</button>
          </div>
        </main>
      </div>
    );
  }

  // Determine how to render the content based on file type
  const renderContent = () => {
    const { fileType, fileContent, description } = fileData;

    // 1. If it's an Image
    if (fileType && fileType.startsWith("image/")) {
      return <img src={fileContent} alt="View" className="preview-image" />;
    }

    // 2. If it's a PDF
    // ✅ ADDED PARAMS: #toolbar=0&navpanes=0&view=FitH
    // This hides the sidebar (navpanes), hides the toolbar, and fits width (FitH)
    if (fileType === "application/pdf") {
      return (
        <iframe 
          src={`${fileContent}#toolbar=0&navpanes=0&view=FitH`} 
          title="PDF View"
          className="preview-iframe" 
        />
      );
    }

    // 3. Fallback Text
    return (
      <div className="preview-text-content">
        <h3>{fileData.title}</h3>
        <p className="meta-text">
          <strong>Course:</strong> {fileData.course || "General"} <br/>
          <strong>Instructor:</strong> {fileData.instructor || "Unknown"}
        </p>
        <hr className="divider"/>
        
        <div className="document-body">
           <p>{description}</p>
           {/* Placeholder text */}
           <p>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
           <br />
           <p className="watermark-text">
             (This is a view of the document content. Download to view the full file.)
           </p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        {/* Header */}
        <header className="header preview-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="file-info-header">
              <h1>{fileData.title}</h1>
              <p>
                {fileData.course || "Course Name"} • {fileData.uploadedBy || "Anonymous"} • {fileData.date || "Just now"}
              </p>
            </div>
          </div>
          
          <div className="header-right">
            <button className="studocu-download-btn">
              <Download size={18} /> Download
            </button>
            <div className="icon-actions">
              <button className="icon-action"><ThumbsUp size={18} /></button>
              <button className="icon-action"><ThumbsDown size={18} /></button>
              <button className="icon-action"><Share2 size={18} /></button>
              <button className="icon-action"><Flag size={18} /></button>
            </div>
            <div className="user-profile-icon">
                <User size={20} />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="studocu-preview-wrapper full-screen-mode">
          
          {/* The "Paper" Document */}
          <div className="document-paper full-width">
            {renderContent()}
          </div>

        </div>
      </main>
    </div>
  );
}