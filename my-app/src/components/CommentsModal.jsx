import React, { useState, useEffect } from "react";
import { X, Send, User, MessageCircle } from "lucide-react";
import ApiService from "../services/api";
import Swal from 'sweetalert2';

export default function CommentsModal({ isOpen, onClose, reviewId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && reviewId) {
      loadComments();
    }
  }, [isOpen, reviewId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const commentsData = await ApiService.getReviewComments(reviewId);
      setComments(commentsData || []);
    } catch (err) {
      console.error("Error loading comments:", err);
      // Don't show error if there are no comments (empty array is fine)
      if (err.message && !err.message.includes('404')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load comments: ' + (err.message || 'Unknown error')
        });
      }
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) {
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.createReviewComment(reviewId, currentUserId, newComment.trim());
      setNewComment("");
      await loadComments(); // Reload comments
      Swal.fire({
        icon: 'success',
        title: 'Comment Added',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error submitting comment:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add comment'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <div>
            <h3>Comments</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  style={{ 
                    padding: '16px', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <User size={16} color="#64748b" />
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>
                      {currentUserId && comment.userId === currentUserId ? "You" : comment.userName || "Anonymous"}
                    </span>
                    {comment.createdAt && (
                      <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {currentUserId && (
          <form onSubmit={handleSubmitComment} style={{ padding: '20px 0', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                style={{
                  padding: '10px 20px',
                  background: submitting || !newComment.trim() ? '#cbd5e1' : '#5C0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={16} />
                Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

