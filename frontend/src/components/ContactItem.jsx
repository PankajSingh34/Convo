const ContactItem = ({ contact, isSelected, onClick }) => {
  const getAvatarColor = (name) => {
    const colors = [
      "bg-violet-500",
      "bg-emerald-500",
      "bg-blue-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-indigo-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-4 p-4 cursor-pointer transition-all duration-200 hover:bg-slate-700 border-l-4 ${
        isSelected
          ? "bg-violet-600 border-violet-400"
          : "border-transparent hover:border-slate-600"
      }`}
    >
      <div className="relative">
        <div
          className={`w-12 h-12 ${getAvatarColor(
            contact.name
          )} rounded-full flex items-center justify-center text-white font-semibold`}
        >
          {contact.avatar}
        </div>
        {contact.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-medium truncate">{contact.name}</h3>
          <span className="text-xs text-slate-400">{contact.timestamp}</span>
        </div>
        <p className="text-sm text-slate-400 truncate">{contact.status}</p>
      </div>
    </div>
  );
};

export default ContactItem;
