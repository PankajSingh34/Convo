import { useState, useRef } from "react";
import { User, Send, Paperclip, Smile, X, File } from "lucide-react";
import MessageBubble from "./MessageBubble";
import EmojiPicker from "./EmojiPicker";
import { chatAPI, fileAPI } from "../services/api";

const ChatArea = ({ chatData, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async () => {
    if ((message.trim() || selectedFile) && !sending) {
      setSending(true);
      try {
        let fileUrl = null;
        let fileName = null;
        let fileSize = null;
        let messageType = "text";

        // Upload file first if selected
        if (selectedFile) {
          try {
            const uploadResponse = await fileAPI.uploadFile(selectedFile);
            fileUrl = uploadResponse.file.url;
            fileName = uploadResponse.file.originalName;
            fileSize = uploadResponse.file.size;

            // Determine message type based on file
            if (selectedFile.type.startsWith("image/")) {
              messageType = "image";
            } else {
              messageType = "file";
            }
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
            alert("Failed to upload file: " + uploadError.message);
            setSending(false);
            return;
          }
        }

        // Send message with or without file
        const content = message.trim() || (selectedFile ? fileName : "");
        const response = await chatAPI.sendMessage(
          chatData.contact.id,
          content,
          messageType,
          fileUrl,
          fileName,
          fileSize
        );

        if (onMessageSent) {
          onMessageSent(response.data);
        }

        // Clear inputs
        setMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please try again.");
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
        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mb-3 flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
            <File className="w-5 h-5 text-violet-400" />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
        )}

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

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />

          <button
            onClick={handleAttachmentClick}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={sending || (!message.trim() && !selectedFile)}
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
