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
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Registration failed: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // Dashboard endpoints
  static async getDashboardOverview(userId) {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview?userId=${userId}`);
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to load dashboard: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }

  // User endpoints
  static async getUserProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
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
      body: formData, // FormData for file uploads
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Upload failed: ${errorMessage || 'Server error'} (Status: ${response.status})`);
    }
    
    return await response.json();
  }
}

export default ApiService;