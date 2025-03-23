import { Link } from "react-router-dom";


export default function Login(){
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-25">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">ورود به حساب</h2>
        <form className="flex flex-col space-y-4 text-right">
          <input
            type="email"
            placeholder="ایمیل"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            ورود
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          حساب کاربری ندارید؟ <Link to="/register" className="text-blue-500">ثبت‌نام</Link>
        </p>
      </div>
    </div>
    )
}