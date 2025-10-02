import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate random room ID
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Format user object (remove sensitive data)
export const formatUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasLower && hasUpper && hasNumber && hasSpecial,
    errors: [
      ...(password.length < minLength ? [`Password must be at least ${minLength} characters long`] : []),
      ...(!hasLower ? ['Password must contain at least one lowercase letter'] : []),
      ...(!hasUpper ? ['Password must contain at least one uppercase letter'] : []),
      ...(!hasNumber ? ['Password must contain at least one number'] : []),
      ...(!hasSpecial ? ['Password must contain at least one special character'] : [])
    ]
  };
};

// Create pagination object
export const createPagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 20;
  const totalPages = Math.ceil(total / itemsPerPage);
  
  return {
    currentPage,
    itemsPerPage,
    totalItems: total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Generate avatar color based on username
export const getAvatarColor = (name) => {
  const colors = [
    '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', 
    '#F59E0B', '#6366F1', '#EF4444', '#06B6D4'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};