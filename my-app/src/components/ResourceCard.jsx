import React from "react";
import { FileText, MoreVertical, Bookmark, Download, Star } from "lucide-react";

export default function ResourceCard({ data }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : i < rating ? "half" : ""}`}>
        <Star size={12} fill={i < rating ? "#fbbf24" : "none"} stroke={i < rating ? "#fbbf24" : "currentColor"} />
      </span>
    ));
  };

  return (
    <div className="upload-card">
      <div className="upload-icon">
        <FileText size={24} />
      </div>
      
      <div className="upload-content">
        <h4>{data.title}</h4>
        <p className="upload-meta">
          {data.subject} • {data.professor}
        </p>
        
        <div className="upload-footer">
          <div className="file-info-block">
            <span className="file-type">{data.fileType}</span>
            <span className="upload-time">{data.uploadTime}</span>
          </div>
          <div className="rating">
            {renderStars(data.rating)}
            <span>
              {data.rating} ({data.reviews || 0})
            </span>
          </div>
        </div>
      </div>

      <div className="upload-actions">
        <button className="more-btn">
          <MoreVertical size={20} />
        </button>
        <button className="save-btn">
          <Bookmark size={18} />
          Save
        </button>
        <button className="download-btn">
          <Download size={18} />
          {data.downloads || 0}
        </button>
      </div>
    </div>
  );
}