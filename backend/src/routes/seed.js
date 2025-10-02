import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Mock data for seeding
const mockUsers = [
  {
    username: 'jackhendry',
    email: 'jack.hendry@example.com',
    password: 'password123',
    avatar: 'J',
    status: 'Will update you',
    isOnline: true,
  },
  {
    username: 'sophiaren',
    email: 'sophia.ren@example.com', 
    password: 'password123',
    avatar: 'S',
    status: 'Okay Clarían',
    isOnline: false,
  },
  {
    username: 'jameswilliams',
    email: 'james.williams@example.com',
    password: 'password123',
    avatar: 'J', 
    status: 'Will connect him in call',
    isOnline: true,
  },
  {
    username: 'leenalouise',
    email: 'leena.louise@example.com',
    password: 'password123',
    avatar: 'L',
    status: 'You : Noted',
    isOnline: false,
  },
  {
    username: 'laarah',
    email: 'laarah@example.com',
    password: 'password123',
    avatar: 'L',
    status: 'Sent a voice note', 
    isOnline: false,
  },
  {
    username: 'raymartin',
    email: 'ray.martin@example.com',
    password: 'password123',
    avatar: 'R',
    status: 'We have our meeting today',
    isOnline: false,
  },
];

// Seed database with mock users
router.post('/seed-users', async (req, res) => {
  try {
    // Clear existing users (optional - remove if you want to keep existing users)
    await User.deleteMany({});
    
    const createdUsers = [];
    
    for (const userData of mockUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`Created user: ${user.username}`);
      }
    }
    
    res.status(201).json({
      message: `Successfully seeded ${createdUsers.length} users`,
      users: createdUsers.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        isOnline: user.isOnline
      }))
    });
    
  } catch (error) {
    console.error('Seed users error:', error);
    res.status(500).json({
      error: 'Failed to seed users',
      message: error.message
    });
  }
});

// Seed database with mock messages
router.post('/seed-messages', async (req, res) => {
  try {
    // Find users to create messages between
    const jamesWilliams = await User.findOne({ username: 'jameswilliams' });
    const currentUser = await User.findOne({ username: 'jackhendry' }); // Using Jack as current user
    
    if (!jamesWilliams || !currentUser) {
      return res.status(404).json({
        error: 'Users not found',
        message: 'Please seed users first'
      });
    }
    
    // Clear existing messages (optional)
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    
    const chatRoom = Message.generateChatRoom(currentUser._id, jamesWilliams._id);
    
    const mockMessages = [
      {
        sender: jamesWilliams._id,
        receiver: currentUser._id,
        content: 'Hai Martin, How are you?',
        chatRoom,
        messageType: 'text'
      },
      {
        sender: jamesWilliams._id,
        receiver: currentUser._id,
        content: 'Today we planned for outing. You need to come and pick me after my work',
        chatRoom,
        messageType: 'text'
      },
      {
        sender: currentUser._id,
        receiver: jamesWilliams._id,
        content: 'Sure. I\'m in taxi right now. Will call you once I reach the office',
        chatRoom,
        messageType: 'text'
      },
      {
        sender: currentUser._id,
        receiver: jamesWilliams._id,
        content: 'What about John? Is he coming?',
        chatRoom,
        messageType: 'text'
      },
      {
        sender: jamesWilliams._id,
        receiver: currentUser._id,
        content: 'Will connect with him in call',
        chatRoom,
        messageType: 'text'
      },
    ];
    
    const createdMessages = [];
    for (const messageData of mockMessages) {
      const message = new Message(messageData);
      await message.save();
      createdMessages.push(message);
    }
    
    // Create or update conversation
    const conversation = await Conversation.findOrCreate(currentUser._id, jamesWilliams._id);
    if (createdMessages.length > 0) {
      await conversation.updateLastMessage(createdMessages[createdMessages.length - 1]._id);
    }
    
    res.status(201).json({
      message: `Successfully seeded ${createdMessages.length} messages`,
      messages: createdMessages,
      conversation: conversation
    });
    
  } catch (error) {
    console.error('Seed messages error:', error);
    res.status(500).json({
      error: 'Failed to seed messages',
      message: error.message
    });
  }
});

// Seed everything at once
router.post('/seed-all', async (req, res) => {
  try {
    // First seed users
    await User.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    
    const createdUsers = [];
    for (const userData of mockUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    
    // Then seed messages between first two users
    if (createdUsers.length >= 2) {
      const user1 = createdUsers[0]; // Jack
      const user2 = createdUsers[2]; // James Williams
      
      const chatRoom = Message.generateChatRoom(user1._id, user2._id);
      
      const mockMessages = [
        {
          sender: user2._id,
          receiver: user1._id,
          content: 'Hai Martin, How are you?',
          chatRoom,
          messageType: 'text'
        },
        {
          sender: user2._id,
          receiver: user1._id,
          content: 'Today we planned for outing. You need to come and pick me after my work',
          chatRoom,
          messageType: 'text'
        },
        {
          sender: user1._id,
          receiver: user2._id,
          content: 'Sure. I\'m in taxi right now. Will call you once I reach the office',
          chatRoom,
          messageType: 'text'
        },
        {
          sender: user1._id,
          receiver: user2._id,
          content: 'What about John? Is he coming?',
          chatRoom,
          messageType: 'text'
        },
        {
          sender: user2._id,
          receiver: user1._id,
          content: 'Will connect with him in call',
          chatRoom,
          messageType: 'text'
        },
      ];
      
      const createdMessages = [];
      for (const messageData of mockMessages) {
        const message = new Message(messageData);
        await message.save();
        createdMessages.push(message);
      }
      
      // Create conversation
      const conversation = await Conversation.findOrCreate(user1._id, user2._id);
      if (createdMessages.length > 0) {
        await conversation.updateLastMessage(createdMessages[createdMessages.length - 1]._id);
      }
      
      res.status(201).json({
        message: 'Successfully seeded all data',
        users: createdUsers.length,
        messages: createdMessages.length,
        conversations: 1
      });
    } else {
      res.status(201).json({
        message: 'Successfully seeded users only',
        users: createdUsers.length,
        messages: 0,
        conversations: 0
      });
    }
    
  } catch (error) {
    console.error('Seed all error:', error);
    res.status(500).json({
      error: 'Failed to seed data',
      message: error.message
    });
  }
});

// Clear all data
router.delete('/clear-all', async (req, res) => {
  try {
    await User.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    
    res.json({
      message: 'Successfully cleared all data'
    });
    
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({
      error: 'Failed to clear data',
      message: error.message
    });
  }
});

export default router;