import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    chatRoom: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

// Static method to find or create conversation
conversationSchema.statics.findOrCreate = async function (userId1, userId2) {
  const chatRoom = [userId1, userId2].sort().join("_");

  let conversation = await this.findOne({ chatRoom });

  if (!conversation) {
    conversation = new this({
      participants: [userId1, userId2],
      chatRoom,
      unreadCount: new Map([
        [userId1.toString(), 0],
        [userId2.toString(), 0],
      ]),
    });
    await conversation.save();
  }

  return conversation;
};

// Update last message
conversationSchema.methods.updateLastMessage = function (messageId) {
  this.lastMessage = messageId;
  this.lastMessageTime = new Date();
  return this.save();
};

// Increment unread count for a user
conversationSchema.methods.incrementUnread = function (userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Reset unread count for a user
conversationSchema.methods.resetUnread = function (userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
