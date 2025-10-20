import { useState } from "react";
import { Home, Users, Bell, User, Send, Paperclip, Smile } from "lucide-react";
import MessageBubble from "./MessageBubble";
import EmojiPicker from "./EmojiPicker";
import { chatAPI } from "../services/api";

const ChatArea = ({ chatData, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim() && !sending) {
      setSending(true);
      try {
        const response = await chatAPI.sendMessage(
          chatData.contact.id,
          message.trim()
        );

        // Call callback to update messages in parent component
        if (onMessageSent) {
          onMessageSent(response.data);
        }

        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
        // You could add error handling UI here
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
              {chatData.contact.avatar}
            </div>
            {chatData.contact.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {chatData.contact.name}
            </h2>
            <p className="text-sm text-slate-400">
              {chatData.contact.isOnline ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatData.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-slate-700 relative">
        <div className="flex items-center space-x-4 bg-slate-700 rounded-2xl p-3">
          <button
            onClick={toggleEmojiPicker}
            className={`p-2 transition-colors ${
              showEmojiPicker
                ? "text-violet-400 bg-violet-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
          />

          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white rounded-full transition-colors"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Emoji Picker */}
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      </div>
    </div>
  );
};

export default ChatArea;
