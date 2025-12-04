import React from "react";
import { FileText, User, Star, Download, MessageCircle } from "lucide-react"; // ✅ Added MessageCircle

export default function SearchCard({ data, onRate, onDownload, onPreview, onCommentClick }) { // ✅ Added onCommentClick
  return (
    // ✅ Added style={{ position: 'relative' }} to ensure the button stays inside the card
    <div className="search-card-item" style={{ position: 'relative' }}>
      
      {/* --- NEW COMMENT BUTTON (UPPER RIGHT) --- */}
      <button 
        className="comment-corner-btn" 
        onClick={() => onCommentClick && onCommentClick(data)}
        title="View Comments"
      >
        <MessageCircle size={18} />
        <span className="comment-count">{data.reviews || 0}</span>
      </button>

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