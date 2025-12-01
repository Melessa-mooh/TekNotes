import React from "react";
import { FileText, User, Star, Download } from "lucide-react";

export default function SearchCard({ data, onRate, onDownload, onPreview }) {
  return (
    <div className="search-card-item">
      
      {/* Top Section: Icon + Text */}
      <div className="card-header-section">
        <div className="file-icon-wrapper">
          <FileText size={24} strokeWidth={1.5} />
        </div>
        <div className="card-text-content">
          <h4>{data.title}</h4>
          <p>{data.description}</p>
        </div>
      </div>

      {/* Middle Section: Author, Date, Stats */}
      <div className="card-meta-section">
        <div className="meta-left">
          <div className="meta-item">
            <User size={14} />
            <span>{data.author}</span>
          </div>
          <div className="meta-item">
            <span>📅 {data.date}</span>
          </div>
        </div>
        
        <div className="meta-right">
          <div className="rating-badge">
            <Star size={12} fill="#fbbf24" stroke="none" />
            <span>{data.rating}</span>
          </div>
          <div className="download-badge">
            <Download size={12} />
            <span>{data.downloads}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Uploader & Buttons */}
      <div className="card-footer-section">
        <div className="uploader-block">
          <div className="uploader-avatar">
            <div style={{width:'100%', height:'100%', background:'#ddd', borderRadius: '50%'}}></div>
          </div>
          <span>Uploaded by {data.uploadedBy}</span>
        </div>
        
        <div className="card-action-buttons">
          <button className="btn-rate" onClick={() => onRate(data)}>
            <Star size={14} /> Rate
          </button>
          
          {/* ✅ UPDATED: Preview Button */}
          <button className="btn-preview" onClick={() => onPreview(data)}>
            Preview
          </button>
          
          <button className="btn-download" onClick={() => onDownload(data)}>
            <Download size={14} /> Downloads
          </button>
        </div>
      </div>

    </div>
  );
}