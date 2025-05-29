import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

interface ErrorResponse {
  status?: number;
  statusText?: string;
  message?: string;
  data?: {
    message?: string;
  };
}

const Error: React.FC = () => {
  const error = useRouteError() as ErrorResponse;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6">
          <FaExclamationTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-vazirmatn">متأسفیم!</h1>
          <p className="text-gray-600 font-vazirmatn text-lg mb-2">
            صفحه مورد نظر شما یافت نشد
          </p>
          <p className="text-gray-600 font-vazirmatn">
            {error.data?.message || error.message || 'لطفاً مسیر وارد شده را بررسی کنید'}
          </p>
          {error.status && (
            <p className="text-sm text-gray-500 mt-2 font-vazirmatn">
              کد خطا: {error.status} {error.statusText}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-vazirmatn font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2"
          >
            <FaHome className="w-5 h-5" />
            بازگشت به صفحه اصلی
          </Link>

          <p className="text-sm text-gray-500 mt-4 font-vazirmatn">
            اگر فکر می‌کنید این یک خطا است، لطفاً با پشتیبانی تماس بگیرید
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error; 