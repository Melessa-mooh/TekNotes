import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  Upload, 
  Bell, 
  User, 
  Menu, 
  FileText, 
  CloudUpload,
  CheckCircle,
  X 
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css"; 
import "../styles/uploads.css";   

export default function Uploads() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    instructor: "",
    courseCode: "",
    tags: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper: Convert File to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const processFile = (file) => {
    if (file) {
      // Limit file size to avoid LocalStorage crash (e.g., 2MB limit for this demo)
      if (file.size > 2 * 1024 * 1024) {
        alert("For this demo, please upload files smaller than 2MB.");
        return;
      }
      setSelectedFile(file);
      if (!formData.title) {
        setFormData(prev => ({...prev, title: file.name.split('.')[0]}));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onDropzoneClick = () => { fileInputRef.current.click(); };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title || !selectedFile) {
      alert("Please fill in the title and select a file.");
      return;
    }

    try {
      // 1. Convert file content to string
      const fileBase64 = await convertToBase64(selectedFile);

      // 2. Create Note Object
      const newNote = {
        id: Date.now(),
        title: formData.title,
        description: formData.description || "No description provided.",
        instructor: formData.instructor || "Unknown Instructor",
        course: formData.course || "General",
        date: new Date().toLocaleDateString(),
        rating: 0,
        downloadCount: 0,
        uploadedBy: "Me",
        fileName: selectedFile.name,
        fileType: selectedFile.type, // Store MIME type (e.g., 'image/png', 'application/pdf')
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
        fileContent: fileBase64 // ✅ ACTUAL FILE CONTENT STORED HERE
      };

      // 3. Save to LocalStorage
      const existingNotes = JSON.parse(localStorage.getItem("myMaterials")) || [];
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("myMaterials", JSON.stringify(updatedNotes));

      navigate("/materials"); 
    } catch (error) {
      console.error("Error converting file:", error);
      alert("There was an error processing your file.");
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
            <div className="page-header-text">
              <h1>Upload Materials</h1>
              <p>Share your study materials with the community</p>
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn-primary" onClick={handleUpload}>
              <Upload size={18} /> Upload
            </button>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
          </div>
        </header>

        <div className="uploads-container">
          <div className={`upload-dropzone ${isDragging ? "dragging" : ""}`} 
            onClick={onDropzoneClick} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} />
            <div className="dropzone-content">
              {selectedFile ? (
                <div className="file-selected-view">
                  <div className="upload-icon-large" style={{ color: "#16a34a" }}>
                    <CheckCircle size={48} />
                  </div>
                  <h3 style={{ color: "#16a34a" }}>{selectedFile.name}</h3>
                  <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                  <button className="remove-file-btn" onClick={removeFile}><X size={14} /> Remove file</button>
                </div>
              ) : (
                <>
                  <div className="upload-icon-large"><CloudUpload size={48} /></div>
                  <h3>Uploaded Materials</h3>
                  <p>{isDragging ? "Drop file now..." : "Drag and drop files here, or click to browse"}</p>
                  <span className="file-limit">Maximum file size: 2MB (Demo limit)</span>
                </>
              )}
            </div>
          </div>

          <div className="upload-form-card">
            <div className="form-header">
              <FileText size={24} className="form-icon-red" />
              <h2>Note Information</h2>
            </div>
            <form className="note-form" onSubmit={handleUpload}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title:</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <input type="text" name="course" value={formData.course} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description:</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instructor:</label>
                  <input type="text" name="instructor" value={formData.instructor} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Course code :</label>
                  <input type="text" name="courseCode" value={formData.courseCode} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Tags:</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} />
              </div>
            </form>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button className="submit-upload-btn" onClick={handleUpload}><Upload size={18} /> Upload</button>
          </div>
        </div>
      </main>
    </div>
  );
}