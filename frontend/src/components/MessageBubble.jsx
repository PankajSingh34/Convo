const MessageBubble = ({ message }) => {
  const isSent = message.type === 'sent';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isSent
            ? 'bg-violet-600 text-white rounded-br-md'
            : 'bg-slate-700 text-white rounded-bl-md'
        } shadow-lg`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isSent ? 'text-violet-200' : 'text-slate-400'
        }`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;