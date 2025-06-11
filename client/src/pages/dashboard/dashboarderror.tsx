import { useRouteError, Link, useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaSignOutAlt, FaSignInAlt } from "react-icons/fa"; // اضافه شد
import { useDashboardContext } from "./dashboard";

interface ErrorResponse {
  status?: number;
  statusText?: string;
  message?: string;
  data?: {
    message?: string;
  };
}

const DashboardError = () => {
  const error = useRouteError() as ErrorResponse;
  const { logoutUser } = useDashboardContext();
  const navigate = useNavigate();
  // تشخیص نوع خطا برای نمایش پیام مناسب
  const isAuthError = error.status === 401 || error.status === 403;
  const errorMessage = error.data?.message || error.message;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6">
          <FaExclamationTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isAuthError ? 'دسترسی محدود شده!' : 'خطایی رخ داد!'}
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            {isAuthError ? 'شما به این بخش دسترسی ندارید' : 'متأسفانه در اجرای درخواست شما مشکلی پیش آمده است'}
          </p>
          <p className="text-gray-600">
            {errorMessage || 'لطفاً مجدداً تلاش کنید'}
          </p>
          {error.status && (
            <p className="text-sm text-gray-500 mt-2">
              کد خطا: {error.status} {error.statusText}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2 text-sm"
          >
            <FaHome className="text-base" />
            <span>بازگشت به داشبورد</span>
          </Link>

          <button
            onClick={logoutUser}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2 text-sm"
          >
            <FaSignOutAlt className="text-base" />
            <span>خروج از حساب</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md inline-flex items-center gap-2 text-sm"
          >
            <FaSignInAlt className="text-base" /> {/* آیکن ورود */}
            ورود به حساب کاربری
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          اگر مشکل همچنان ادامه دارد، لطفاً با پشتیبانی تماس بگیرید
        </p>
      </div>
    </div>
  );
};

export default DashboardError;