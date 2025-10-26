import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Auth from "./components/Auth";
import LoadingSpinner from "./components/LoadingSpinner";
import { authAPI, usersAPI, chatAPI } from "./services/api";
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
} from "./services/socket";

function App() {
  const [user, setUser] = useState(null); // null means not authenticated
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        loadContacts();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Load contacts from API
  const loadContacts = async () => {
    try {
      const response = await usersAPI.getUsers();
      setContacts(response.users);

      // Auto-select James Williams if available
      const jamesWilliams = response.users.find(
        (u) => u.username === "jameswilliams"
      );
      if (jamesWilliams) {
        setSelectedContactId(jamesWilliams._id);
        loadMessages(jamesWilliams._id);
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  // Load messages for selected contact
  const loadMessages = async (contactId) => {
    try {
      const response = await chatAPI.getMessages(contactId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    }
  };

  // Initialize Socket.IO when user is authenticated
  useEffect(() => {
    if (user) {
      const socket = initializeSocket(user._id);

      // Listen for user online status updates
      socket.on("user-status-changed", ({ userId, isOnline }) => {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === userId ? { ...contact, isOnline } : contact
          )
        );
      });

      // Listen for new messages
      socket.on("new-message", (message) => {
        console.log("📨 New message received via socket:", message);

        // Check if this message is for the current user or from the current selected contact
        const isRelevantMessage =
          (message.receiverId === user._id || message.senderId === user._id) &&
          selectedContactId &&
          (message.senderId === selectedContactId ||
            message.receiverId === selectedContactId);

        if (isRelevantMessage) {
          // Format the message for display
          const formattedMessage = {
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            timestamp: message.timestamp,
            type: message.senderId === user._id ? "sent" : "received",
            isRead: message.isRead,
            messageType: message.messageType || "text",
            isEdited: message.isEdited || false,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            fileSize: message.fileSize,
          };

          // Add message to the list if it's not already there
          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (msg) => msg.id === formattedMessage.id
            );
            if (!exists) {
              return [...prevMessages, formattedMessage];
            }
            return prevMessages;
          });
        }

        // Refresh contacts to update last message preview
        loadContacts();
      });

      // Cleanup on unmount or logout
      return () => {
        disconnectSocket();
      };
    }
  }, [user, selectedContactId]);

  const handleAuthenticated = (userData) => {
    setUser(userData);
    loadContacts();
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setContacts([]);
      setMessages([]);
      setSelectedContactId(null);
    }
  };

  const handleContactSelect = (contactId) => {
    setSelectedContactId(contactId);
    loadMessages(contactId);
  };

  const handleMessageSent = (newMessage) => {
    // Add the new message to the current messages array, checking for duplicates
    setMessages((prevMessages) => {
      const exists = prevMessages.some((msg) => msg.id === newMessage.id);
      if (!exists) {
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });

    // Optionally refresh the contacts list to update last message
    loadContacts();
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // If user is not authenticated, show Auth components
  if (!user) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Find selected contact data
  const selectedContact = contacts.find((c) => c._id === selectedContactId);
  const currentChat = selectedContact
    ? {
        contact: {
          id: selectedContact._id,
          name: selectedContact.username,
          avatar: selectedContact.avatar,
          status: selectedContact.status,
          timestamp: "Just now",
          isOnline: selectedContact.isOnline,
        },
        messages: messages,
      }
    : null;

  // If user is authenticated, show the main chat app
  return (
    <div className="h-screen bg-slate-900 flex">
      <Sidebar
        contacts={contacts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedContactId={selectedContactId}
        onContactSelect={handleContactSelect}
        user={user}
        onLogout={handleLogout}
      />
      {currentChat ? (
        <ChatArea chatData={currentChat} onMessageSent={handleMessageSent} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Select a conversation
            </h2>
            <p className="text-slate-400">
              Choose someone from your contacts to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
