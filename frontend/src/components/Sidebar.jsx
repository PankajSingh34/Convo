import { MessageCircle, LogOut, Settings } from "lucide-react";
import ContactItem from "./ContactItem";

const Sidebar = ({
  contacts,
  activeTab,
  onTabChange,
  selectedContactId,
  onContactSelect,
  user,
  onLogout,
}) => {
  const tabs = ["All", "Favorite", "Groups"];

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Convo</h1>
            <p className="text-sm text-slate-400">Connect & Chat</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-700 rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <ContactItem
            key={contact._id}
            contact={{
              id: contact._id,
              name: contact.username,
              avatar: contact.avatar,
              status: contact.status,
              timestamp: contact.lastMessage ? "Just now" : "No messages",
              isOnline: contact.isOnline,
              unreadCount: 0, // TODO: implement unread count
            }}
            isSelected={selectedContactId === contact._id}
            onClick={() => onContactSelect(contact._id)}
          />
        ))}
      </div>

      {/* User Profile & Logout */}
      {user && (
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">
                  {user.username}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
