// services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Auth endpoints
  static async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Login failed: ${errorMessage || 'Invalid credentials'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Registration failed: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  static async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    
    return await response.json();
  }

  // Dashboard endpoints
  static async getDashboardOverview(userId) {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview?userId=${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to load dashboard: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // User endpoints
  static async getUserProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to load user profile: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // Resource endpoints
  static async uploadResource(formData) {
    const response = await fetch(`${API_BASE_URL}/resources/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // FormData for file uploads
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Upload failed: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async getAllResources() {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch resources: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async getUserResources(userId) {
    const response = await fetch(`${API_BASE_URL}/resources/user/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch user resources: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }
  

  static async getResourceById(resourceId) {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch resource: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // Bookmark endpoints
  static async getUserBookmarks(userId) {
    const response = await fetch(`${API_BASE_URL}/bookmarks/user/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch bookmarks: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async createBookmark(bookmarkData) {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bookmarkData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to create bookmark: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async deleteBookmark(bookmarkId) {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete bookmark: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
  }

  static async checkBookmark(userId, resourceId) {
    const response = await fetch(`${API_BASE_URL}/bookmarks/check/${userId}/${resourceId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    return await response.json();
  }

  static async toggleBookmark(userId, resourceId) {
    const response = await fetch(`${API_BASE_URL}/bookmarks/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, resourceId }),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to toggle bookmark: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // Review endpoints
  static async getUserReviews(userId) {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch reviews: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async getAllReviews(userId = null) {
    const url = userId ? `${API_BASE_URL}/reviews?userId=${userId}` : `${API_BASE_URL}/reviews`;
    const response = await fetch(url, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch reviews: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async getResourceReviews(resourceId) {
    const response = await fetch(`${API_BASE_URL}/reviews/resource/${resourceId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch resource reviews: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async createReview(reviewData) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to create review: ${errorMessage}`);
    }
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (e) {
      console.warn('Response was not valid JSON, but request succeeded');
      return {};
    }
  }

  static async deleteReview(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete review: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
  }

  // Download endpoints
  static async getUserDownloads(userId) {
    const response = await fetch(`${API_BASE_URL}/downloads/user/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch downloads: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  static async createDownload(userId, resourceId) {
    const response = await fetch(`${API_BASE_URL}/downloads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, resourceId }),
    });
    
    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to create download: ${errorMessage}`);
    }
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // If response is not JSON, return empty object
        return {};
      }
    } catch (e) {
      // If JSON parsing fails, return empty object
      console.warn('Response was not valid JSON, but request succeeded');
      return {};
    }
  }

  static async deleteDownload(downloadId) {
    const response = await fetch(`${API_BASE_URL}/downloads/${downloadId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete download: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
  }

  static async createDownloadFromSharedFile(userId, fileUrl, fileName, uploadedByUserId) {
    const response = await fetch(`${API_BASE_URL}/downloads/shared-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        userId, 
        fileUrl, 
        fileName,
        uploadedByUserId 
      }),
    });
    
    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to track download: ${errorMessage}`);
    }
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (e) {
      console.warn('Response was not valid JSON, but request succeeded');
      return {};
    }
  }

  // Review Like endpoints
  static async toggleReviewLike(reviewId, userId) {
    const response = await fetch(`${API_BASE_URL}/reviews/likes/toggle/${reviewId}/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to toggle like: ${errorMessage}`);
    }
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (e) {
      console.warn('Response was not valid JSON, but request succeeded');
      return {};
    }
  }

  static async getReviewLikeCount(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/likes/count/${reviewId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return 0;
    }
    
    return await response.json();
  }

  static async checkReviewLike(reviewId, userId) {
    const response = await fetch(`${API_BASE_URL}/reviews/likes/check/${reviewId}/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    return await response.json();
  }

  // Review Comment endpoints
  static async getReviewComments(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/comments/review/${reviewId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      // If 404 or empty, return empty array instead of throwing error
      if (response.status === 404) {
        return [];
      }
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to fetch comments: ${errorMessage}`);
    }
    
    try {
      return await response.json();
    } catch (e) {
      console.warn('Response was not valid JSON');
      return [];
    }
  }

  static async createReviewComment(reviewId, userId, comment) {
    const response = await fetch(`${API_BASE_URL}/reviews/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ reviewId, userId, comment }),
    });
    
    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}`;
      }
      throw new Error(`Failed to create comment: ${errorMessage}`);
    }
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {};
      }
    } catch (e) {
      console.warn('Response was not valid JSON, but request succeeded');
      return {};
    }
  }

  static async deleteReviewComment(commentId) {
    const response = await fetch(`${API_BASE_URL}/reviews/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete comment: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
  }

  static async getReviewCommentCount(reviewId) {
    const response = await fetch(`${API_BASE_URL}/reviews/comments/count/${reviewId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return 0;
    }
    
    return await response.json();
  }

  // Study Groups endpoints
  static async createGroup(groupData) {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(groupData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to create group: ${errorMessage || 'Server error'}`);
    }
    
    return await response.json();
  }

  static async getAllGroups() {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.status}`);
    }
    
    return await response.json();
  }

  static async getVerifiedGroups() {
    const response = await fetch(`${API_BASE_URL}/groups/verified`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch verified groups: ${response.status}`);
    }
    
    return await response.json();
  }

  static async getUserGroups(userId) {
    const response = await fetch(`${API_BASE_URL}/groups/user/${userId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user groups: ${response.status}`);
    }
    
    return await response.json();
  }

  static async getGroupById(groupId) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch group: ${response.status}`);
    }
    
    return await response.json();
  }

  static async joinGroup(groupId, userId, password = null) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password: password }),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to join group: ${errorMessage || 'Server error'}`);
    }
    
    return await response.text();
  }

  static async leaveGroup(groupId, userId) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to leave group: ${errorMessage || 'Server error'}`);
    }
    
    return await response.text();
  }

  // Chat Messages endpoints
  static async sendMessage(messageData) {
    const response = await fetch(`${API_BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to send message: ${errorMessage || 'Server error'}`);
    }
    
    return await response.json();
  }

  static async getMessagesByGroup(groupId) {
    const response = await fetch(`${API_BASE_URL}/chat-messages/group/${groupId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }
    
    return await response.json();
  }

  static async deleteMessage(messageId) {
    const response = await fetch(`${API_BASE_URL}/chat-messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.status}`);
    }
  }

  // Shared Files endpoints
  static async uploadSharedFile(formData) {
    const response = await fetch(`${API_BASE_URL}/shared-files/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to upload file: ${errorMessage || 'Server error'}`);
    }
    
    return await response.json();
  }

  static async getSharedFilesByGroup(groupId) {
    const response = await fetch(`${API_BASE_URL}/shared-files/group/${groupId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch shared files: ${response.status}`);
    }
    
    return await response.json();
  }

  static async deleteSharedFile(fileId) {
    const response = await fetch(`${API_BASE_URL}/shared-files/${fileId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.status}`);
    }
  }

  // User Study Preferences
  static async updateUserPreferences(userId, preferences) {
    // First get current user data
    const currentUser = await ApiService.getUserProfile(userId);
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        studyPreferences: preferences
      }),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update preferences: ${errorMessage || 'Server error'}`);
    }
    
    return await response.json();
  }


  static async deleteResource(resourceId) {
 const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
 method: 'DELETE',
 credentials: 'include', // Use 'credentials: include' for session/cookie-based auth
 });
 
 if (!response.ok) {
const errorMessage = await response.text();
// Provide a descriptive error, which will be caught and shown in the frontend
throw new Error(`Failed to delete resource: ${errorMessage || 'Server error'} (Status: ${response.status})`);
 }
 // A successful DELETE often returns a 204 No Content, so we don't return JSON
 return true; 
 }

static async getReviews(resourceId) {
     const response = await fetch(`${API_BASE_URL}/reviews/resource/${resourceId}`, {
       credentials: 'include',
     });
     
     if (!response.ok) {
       if (response.status === 404) return [];
       console.error("Failed to fetch reviews");
       return [];
     }
     
     return await response.json();
   }
}


export default ApiService;