import { MessageCircle } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center animate-pulse">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;