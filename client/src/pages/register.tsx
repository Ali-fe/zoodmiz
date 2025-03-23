import { Link } from "react-router-dom";

export default function Register(){
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-25">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">ثبت نام</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">نام</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">نام خانوادگی</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">شماره همراه</label>
              <input type="tel" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">آدرس</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">نام رستوران</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">رمز عبور</label>
              <input type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">تکرار رمز عبور</label>
              <input type="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">ثبت نام</button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            حساب کاربری دارید؟ <Link to="/login" className="text-blue-500 hover:underline">وارد شوید</Link>
          </p>
        </div>
      </div>
    )
}