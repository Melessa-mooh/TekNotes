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
      const errorMessage = await response.text();
      throw new Error(`Failed to create review: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
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
}

export default ApiService;