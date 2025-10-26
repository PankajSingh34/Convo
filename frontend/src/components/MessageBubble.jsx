import { Download, File, Image as ImageIcon } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

const MessageBubble = ({ message }) => {
  const isSent = message.type === "sent";
  const hasFile =
    message.messageType === "file" || message.messageType === "image";

  const handleDownload = async () => {
    if (message.fileUrl) {
      const fullUrl = `${API_BASE_URL}${message.fileUrl}`;

      try {
        // Fetch the file
        const response = await fetch(fullUrl);
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = message.fileName || "download";
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        // Fallback: open in new tab
        window.open(fullUrl, "_blank");
      }
    }
  };

  return (
    <div className={`flex ${isSent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isSent
            ? "bg-slate-700 text-white rounded-bl-md"
            : "bg-violet-600 text-white rounded-br-md"
        } shadow-lg`}
      >
        {/* File/Image Display */}
        {hasFile && message.fileUrl && (
          <div className="mb-2">
            {message.messageType === "image" ? (
              <img
                src={`${API_BASE_URL}${message.fileUrl}`}
                alt={message.fileName || "Image"}
                className="rounded-lg max-w-full h-auto cursor-pointer"
                onClick={handleDownload}
              />
            ) : (
              <div
                onClick={handleDownload}
                className="flex items-center gap-2 p-3 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors"
              >
                <File className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileName || "File"}
                  </p>
                  {message.fileSize && (
                    <p className="text-xs opacity-75">
                      {(message.fileSize / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
                <Download className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {/* Message Text */}
        {message.content && (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}

        {/* Timestamp */}
        <p
          className={`text-xs mt-1 ${
            isSent ? "text-slate-400" : "text-violet-200"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
