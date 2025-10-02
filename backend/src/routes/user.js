import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Get all users (for contact list)
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const currentUserId = req.userId;

    // Build search query
    let query = { _id: { $ne: currentUserId } }; // Exclude current user
    
    if (search) {
      const searchTerm = search.toLowerCase();
      query.$or = [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort({ username: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get last messages for each user (for contact list preview)
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const chatRoom = Message.generateChatRoom(currentUserId, user._id);
        const lastMessage = await Message.findOne({ chatRoom })
          .sort({ createdAt: -1 })
          .populate('sender', 'username');

        return {
          ...user.toJSON(),
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.createdAt,
            sender: lastMessage.sender.username
          } : null
        };
      })
    );

    res.json({
      message: 'Users retrieved successfully',
      users: usersWithLastMessage,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        hasMore: (page * limit) < total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve users'
    });
  }
});

// Get user profile by ID
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'User profile retrieved successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user profile'
    });
  }
});

// Update user profile
router.put('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, avatar, bio } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // In a real app, check if the requesting user is the same as the user being updated
    // if (req.user.id !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    // Check if email is already taken by another user
    if (email) {
      const emailTaken = users.find(u => u.email === email && u.id !== userId);
      if (emailTaken) {
        return res.status(400).json({
          error: 'Email already taken',
          message: 'Another user is already using this email address'
        });
      }
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...(username && { username }),
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(bio && { bio }),
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update profile'
    });
  }
});

// Update user online status
router.patch('/:userId/status', (req, res) => {
  try {
    const { userId } = req.params;
    const { isOnline } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Update status
    users[userIndex] = {
      ...users[userIndex],
      isOnline: Boolean(isOnline),
      lastSeen: new Date().toISOString()
    };

    res.json({
      message: 'Status updated successfully',
      status: {
        isOnline: users[userIndex].isOnline,
        lastSeen: users[userIndex].lastSeen
      }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update status'
    });
  }
});

// Get user's contacts/friends
router.get('/:userId/contacts', (req, res) => {
  try {
    const { userId } = req.params;

    // In a real app, this would fetch the user's contact list from the database
    // For now, return all other users as potential contacts
    const contacts = users
      .filter(user => user.id !== userId)
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

    res.json({
      message: 'Contacts retrieved successfully',
      contacts
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve contacts'
    });
  }
});

export default router;