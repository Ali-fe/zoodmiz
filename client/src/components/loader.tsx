import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = 'در حال بارگذاری...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        
        {/* Inner Circle with Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary text-xl font-bold">زود</span>
        </div>
      </div>
      
      {/* Loading Text */}
      <p className="mt-4 text-gray-600 font-vazirmatn animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader; 