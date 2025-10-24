import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Message from './src/models/Message.js';
import Conversation from './src/models/Conversation.js';

// Load environment variables
dotenv.config();

const seedUsers = [
  {
    username: "jackhendry",
    email: "jack.hendry@example.com",
    password: "password123",
    avatar: "J",
    status: "Will update you",
    isOnline: true,
  },
  {
    username: "sophiaren",
    email: "sophia.ren@example.com",
    password: "password123",
    avatar: "S",
    status: "Okay Clarían",
    isOnline: false,
  },
  {
    username: "jameswilliams",
    email: "james.williams@example.com",
    password: "password123",
    avatar: "J",
    status: "Will connect him in call",
    isOnline: true,
  },
  {
    username: "leenalouise",
    email: "leena.louise@example.com",
    password: "password123",
    avatar: "L",
    status: "You : Noted",
    isOnline: false,
  },
  {
    username: "laarah",
    email: "laarah@example.com",
    password: "password123",
    avatar: "L",
    status: "Sent a voice note",
    isOnline: false,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(seedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample conversations and messages
    console.log('💬 Creating sample conversations...');
    
    if (createdUsers.length >= 2) {
      // Create a conversation between first two users
      const conversation = await Conversation.create({
        participants: [createdUsers[0]._id, createdUsers[1]._id],
        lastMessage: 'Hey! How are you?',
        lastMessageTime: new Date(),
      });

      // Create some sample messages
      const messages = [
        {
          conversationId: conversation._id,
          senderId: createdUsers[0]._id,
          receiverId: createdUsers[1]._id,
          content: 'Hey! How are you?',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          conversationId: conversation._id,
          senderId: createdUsers[1]._id,
          receiverId: createdUsers[0]._id,
          content: 'I\'m good! Thanks for asking.',
          timestamp: new Date(Date.now() - 3000000),
        },
        {
          conversationId: conversation._id,
          senderId: createdUsers[0]._id,
          receiverId: createdUsers[1]._id,
          content: 'That\'s great! Want to catch up later?',
          timestamp: new Date(Date.now() - 1800000),
        },
      ];

      await Message.create(messages);
      console.log(`✅ Created ${messages.length} sample messages`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    createdUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
