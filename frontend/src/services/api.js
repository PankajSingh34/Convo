// Use environment variable or fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
    }

    return response;
  },

  register: async (username, email, password) => {
    const response = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
    }

    return response;
  },

  logout: async () => {
    try {
      await apiCall("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    return apiCall("/auth/me");
  },
};

// Users API
export const usersAPI = {
  getUsers: async (search = "", page = 1, limit = 20) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return apiCall(`/users?${params.toString()}`);
  },
};

// Chat API
export const chatAPI = {
  getConversations: async (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return apiCall(`/chat/conversations?${params.toString()}`);
  },

  getMessages: async (otherUserId, page = 1, limit = 50) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return apiCall(`/chat/messages/${otherUserId}?${params.toString()}`);
  },

  sendMessage: async (
    receiverId,
    content,
    messageType = "text",
    fileUrl = null,
    fileName = null,
    fileSize = null
  ) => {
    return apiCall("/chat/send", {
      method: "POST",
      body: JSON.stringify({
        receiverId,
        content,
        messageType,
        fileUrl,
        fileName,
        fileSize,
      }),
    });
  },
};

// File upload API
export const fileAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "File upload failed");
    }

    return response.json();
  },
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = authAPI.getCurrentUser();
  return !!(token && user);
};

// Helper to clear authentication
export const clearAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
};
