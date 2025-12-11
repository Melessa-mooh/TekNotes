import React, { useState, useEffect, useRef } from "react";
import { FileText, MoreVertical, Bookmark, Download, Star, Eye, File } from "lucide-react";
import ApiService from "../services/api";
import Swal from 'sweetalert2';
import ReviewsModal from "./ReviewsModal";

export default function ResourceCard({ data, currentUserId }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const menuRef = useRef(null);

  // Determine if uploader is current user
  const isMyUpload = currentUserId && (data.uploaderUserId === currentUserId || data.uploaderId === currentUserId);
  const uploaderDisplay = isMyUpload ? "You" : (data.uploaderName || data.uploadedBy || "Unknown");

  // Check if resource is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (currentUserId && data.id) {
        try {
          const bookmarked = await ApiService.checkBookmark(currentUserId, data.id);
          setIsBookmarked(bookmarked);
        } catch (err) {
          console.error("Error checking bookmark:", err);
        }
      }
    };
    checkBookmark();
  }, [currentUserId, data.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleOpen = () => {
    setShowMenu(false);
    if (data.fileUrl) {
      // Construct full URL if it's a relative path
      const fileUrl = data.fileUrl.startsWith('http') 
        ? data.fileUrl 
        : `http://localhost:8080${data.fileUrl}`;
      window.open(fileUrl, '_blank');
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'File Not Available',
        text: 'The file URL is not available for this resource.'
      });
    }
  };

  const handlePreview = () => {
    setShowMenu(false);
    const description = data.description || data.tagDescription || 'No description available.';
    Swal.fire({
      title: data.title,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
          <p><strong>Professor:</strong> ${data.professor || 'N/A'}</p>
          <p><strong>File Type:</strong> ${data.fileType || 'N/A'}</p>
          <p><strong>Description:</strong></p>
          <p style="margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
            ${description}
          </p>
          <p style="margin-top: 10px;"><strong>Rating:</strong> ${data.rating || 0} (${data.reviews || data.reviewCount || 0} reviews)</p>
          <p><strong>Downloads:</strong> ${data.downloads || data.downloadCount || 0}</p>
          <p style="margin-top: 10px; font-size: 12px; color: #64748b;"><strong>Uploaded by:</strong> ${uploaderDisplay}</p>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Close'
    });
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!currentUserId || !data.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to download resources',
      });
      return;
    }

    setIsDownloading(true);
    try {
      // Track the download in the backend
      await ApiService.createDownload(currentUserId, data.id);

      // Try to download the file
      if (data.fileUrl) {
        const fileUrl = data.fileUrl.startsWith('http') 
          ? data.fileUrl 
          : `http://localhost:8080${data.fileUrl}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = data.title || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `${data.title} has been added to your downloads`,
        timer: 2000,
        showConfirmButton: false
      });

      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('downloadCompleted'));
    } catch (err) {
      console.error("Error downloading:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download resource: ' + err.message
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!currentUserId || !data.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to bookmark resources',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiService.toggleBookmark(currentUserId, data.id);
      setIsBookmarked(result !== null);
      
      Swal.fire({
        icon: 'success',
        title: result ? 'Bookmarked!' : 'Removed!',
        text: result ? 'Resource added to your bookmarks' : 'Resource removed from bookmarks',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to bookmark resource'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          Uploaded by {uploaderDisplay}
        </p>
        
        <div className="upload-footer">
          <div className="file-info-block">
            <span className="file-type">{data.fileType}</span>
            <span className="upload-time">{data.uploadTime}</span>
          </div>
          <div 
            className="rating" 
            onClick={() => setShowReviewsModal(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Click to view reviews"
          >
            {renderStars(data.rating)}
            <span>
              {data.rating || 0} ({data.reviews || data.reviewCount || 0} reviews, {data.downloads || data.downloadCount || 0} downloads)
            </span>
          </div>
        </div>
      </div>

      <div className="upload-actions">
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            className="more-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              minWidth: '150px',
              overflow: 'hidden'
            }}>
              <button
                onClick={handleOpen}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#0f172a'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <File size={16} />
                Open
              </button>
              <button
                onClick={handlePreview}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#0f172a',
                  borderTop: '1px solid #e2e8f0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <Eye size={16} />
                View
              </button>
            </div>
          )}
        </div>
        <button 
          className="save-btn" 
          onClick={handleBookmark}
          disabled={isLoading}
          style={{
            backgroundColor: isBookmarked ? '#fbbf24' : '',
            color: isBookmarked ? '#fff' : '',
            borderColor: isBookmarked ? '#fbbf24' : ''
          }}
        >
          <Bookmark size={18} fill={isBookmarked ? '#fff' : 'none'} />
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
        <button 
          className="download-btn" 
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download resource"
        >
          <Download size={18} />
          {data.downloads || data.downloadCount || 0}
        </button>
      </div>

      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        resourceId={data.id}
        resourceTitle={data.title}
        currentUserId={currentUserId}
      />
    </div>
  );
}