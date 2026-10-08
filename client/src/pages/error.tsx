import { useRouteError, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

interface ErrorResponse {
  status?: number;
  statusText?: string;
  message?: string;
  data?: {
    message?: string;
  };
}

export default function Error() {
  const error = useRouteError() as ErrorResponse;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">متأسفیم!</h1>
          <p className="text-gray-600 text-lg mb-2">
            متأسفانه در اجرای درخواست شما مشکلی پیش آمده است
          </p>
          <p className="text-gray-600">
            {error.message || 'لطفاً مجدداً تلاش کنید'}
          </p>
          {error.status && (
            <p className="text-sm text-gray-500 mt-2">
              کد خطا: {error.status} {error.statusText}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2"
          >
            <FaHome className="text-xl" />
            <span>بازگشت به خانه</span>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          اگر مشکل همچنان ادامه دارد، لطفاً با پشتیبانی تماس بگیرید
        </p>
      </div>
    </div>
  );
} 