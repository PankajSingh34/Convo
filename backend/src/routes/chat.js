import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations', async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: currentUserId,
      isActive: true
    })
    .populate('participants', 'username email avatar isOnline lastSeen status')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== currentUserId.toString()
      );

      return {
        id: conv._id,
        chatRoom: conv.chatRoom,
        contact: {
          id: otherParticipant._id,
          name: otherParticipant.username,
          avatar: otherParticipant.avatar,
          status: otherParticipant.status,
          isOnline: otherParticipant.isOnline,
          lastSeen: otherParticipant.lastSeen
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          timestamp: conv.lastMessage.createdAt,
          type: conv.lastMessage.sender.toString() === currentUserId.toString() ? 'sent' : 'received'
        } : null,
        unreadCount: conv.unreadCount.get(currentUserId.toString()) || 0,
        lastMessageTime: conv.lastMessageTime
      };
    });

    res.json({
      message: 'Conversations retrieved successfully',
      conversations: formattedConversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve conversations'
    });
  }
});

// Get messages for a conversation with another user
router.get('/messages/:otherUserId', async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Generate chat room ID
    const chatRoom = Message.generateChatRoom(currentUserId, otherUserId);

    // Get total count
    const total = await Message.countDocuments({ 
      chatRoom,
      isDeleted: false
    });

    // Get messages with pagination (most recent first, then reverse for chronological order)
    const messages = await Message.find({ 
      chatRoom,
      isDeleted: false
    })
    .populate('sender', 'username avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    // Format messages for frontend
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      senderId: msg.sender._id,
      senderName: msg.sender.username,
      content: msg.content,
      timestamp: msg.createdAt,
      type: msg.sender._id.toString() === currentUserId.toString() ? 'sent' : 'received',
      isRead: msg.isRead,
      messageType: msg.messageType,
      isEdited: msg.isEdited
    }));

    // Mark messages as read
    await Message.updateMany(
      { 
        chatRoom,
        receiver: currentUserId,
        isRead: false,
        isDeleted: false
      },
      { 
        isRead: true,
        readAt: new Date()
      }
    );

    // Reset unread count in conversation
    const conversation = await Conversation.findOne({ chatRoom });
    if (conversation) {
      conversation.resetUnread(currentUserId);
    }

    res.json({
      message: 'Messages retrieved successfully',
      messages: formattedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        hasMore: (page * limit) < total
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve messages'
    });
  }
});

// Send a new message
router.post('/send', async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { receiverId, content, messageType = 'text' } = req.body;

    // Validation
    if (!receiverId || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Receiver ID and content are required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Receiver not found'
      });
    }

    // Generate chat room ID
    const chatRoom = Message.generateChatRoom(currentUserId, receiverId);

    // Create new message
    const newMessage = new Message({
      sender: currentUserId,
      receiver: receiverId,
      content,
      messageType,
      chatRoom
    });

    await newMessage.save();

    // Populate sender info for response
    await newMessage.populate('sender', 'username avatar');

    // Create or update conversation
    const conversation = await Conversation.findOrCreate(currentUserId, receiverId);
    await conversation.updateLastMessage(newMessage._id);
    
    // Increment unread count for receiver
    await conversation.incrementUnread(receiverId);

    // Format message for response
    const formattedMessage = {
      id: newMessage._id,
      senderId: newMessage.sender._id,
      senderName: newMessage.sender.username,
      content: newMessage.content,
      timestamp: newMessage.createdAt,
      type: 'sent', // Always sent from current user's perspective
      isRead: newMessage.isRead,
      messageType: newMessage.messageType,
      isEdited: newMessage.isEdited
    };

    res.status(201).json({
      message: 'Message sent successfully',
      data: formattedMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send message'
    });
  }
});

// Create a new chat room
router.post('/rooms', (req, res) => {
  try {
    const { name, description, type = 'private', participants = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Missing room name',
        message: 'Room name is required'
      });
    }

    const newRoom = {
      id: Date.now().toString(),
      name,
      description,
      type, // 'private', 'group', 'channel'
      participants,
      createdBy: req.user?.id || 'anonymous',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    chatRooms.push(newRoom);

    res.status(201).json({
      message: 'Chat room created successfully',
      room: newRoom
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create chat room'
    });
  }
});

// Update message (edit)
router.put('/messages/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        error: 'Message not found',
        message: 'The specified message does not exist'
      });
    }

    const message = messages[messageIndex];
    
    // Check if user owns the message (in real app)
    // if (message.senderId !== req.user.id) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    // Update message
    messages[messageIndex] = {
      ...message,
      content,
      edited: true,
      editedAt: new Date().toISOString()
    };

    res.json({
      message: 'Message updated successfully',
      data: messages[messageIndex]
    });

  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update message'
    });
  }
});

// Delete message
router.delete('/messages/:messageId', (req, res) => {
  try {
    const { messageId } = req.params;

    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        error: 'Message not found',
        message: 'The specified message does not exist'
      });
    }

    // Remove message
    messages.splice(messageIndex, 1);

    res.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete message'
    });
  }
});

export default router;