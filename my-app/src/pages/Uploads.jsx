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
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/uploads.css";
import ApiService from "../services/api";

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
    tags: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFile = (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload files smaller than 10MB.");
      return;
    }

    setSelectedFile(file);

    if (!formData.title) {
      setFormData((prev) => ({
        ...prev,
        title: file.name.split(".")[0],
      }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ CONNECT TO BACKEND
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title || !selectedFile) {
      alert("Please fill in the title and select a file.");
      return;
    }

    // get current user id from login
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.id || user.userId;

    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("title", formData.title);
      form.append("description", formData.description || "");
      form.append("courseName", formData.course || "");
      form.append("courseCode", formData.courseCode || "");
      form.append("teacherName", formData.instructor || "");
      form.append("tags", formData.tags || "");
      form.append("userId", userId);

      const data = await ApiService.uploadResource(form);

      alert("Upload successful!");
      navigate("/materials");
    } catch (err) {
      console.error(err);
      alert("There was an error uploading your file: " + err.message);
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
            <div className="page-header-text">
              <h1>Upload Materials</h1>
              <p>Share your study materials with the community</p>
            </div>
          </div>
          <div className="header-right">
            <button className="upload-btn-primary" onClick={handleUpload}>
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

        {/* Upload content */}
        <div className="uploads-container">
          {/* Dropzone */}
          <div
            className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
            onClick={onDropzoneClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <div className="dropzone-content">
              {selectedFile ? (
                <div className="file-selected-view">
                  <div
                    className="upload-icon-large"
                    style={{ color: "#16a34a" }}
                  >
                    <CheckCircle size={48} />
                  </div>
                  <h3 style={{ color: "#16a34a" }}>
                    {selectedFile.name}
                  </h3>
                  <p>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •
                    Ready to upload
                  </p>
                  <button
                    className="remove-file-btn"
                    onClick={removeFile}
                  >
                    <X size={14} /> Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-icon-large">
                    <CloudUpload size={48} />
                  </div>
                  <h3>Uploaded Materials</h3>
                  <p>
                    {isDragging
                      ? "Drop file now..."
                      : "Drag and drop files here, or click to browse"}
                  </p>
                  <span className="file-limit">
                    Maximum file size: 10MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="upload-form-card">
            <div className="form-header">
              <FileText size={24} className="form-icon-red" />
              <h2>Note Information</h2>
            </div>
            <form className="note-form" onSubmit={handleUpload}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Description:</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instructor:</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Course code :</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Tags:</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>

          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              className="submit-upload-btn"
              onClick={handleUpload}
            >
              <Upload size={18} /> Upload
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}