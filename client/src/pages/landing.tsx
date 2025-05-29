import { Link } from "react-router-dom";
import { features } from "./../assets/data";
import AuthLoader from "../components/AuthLoader";

export default function Landing() {
  return (
    <AuthLoader showToast={false}>
      <div className="pt-25">
        {/* Hero Section */}
        <section className="text-center py-20 bg-blue-500 text-white rounded-lg shadow-lg mx-6 mt-6">
          <h2 className="text-5xl font-vazirmatn">به زودمیز خوش آمدید</h2>
          <p className="mt-4 text-xl font-vazirmatn">تجربه ای نو از سفارش و رزرو</p>
          <p className="mt-4 text-xl font-vazirmatn">همراه رستوران‌ها، راحتی مشتریان</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link 
              to='/register' 
              className="px-6 py-3 bg-white text-blue-500 font-vazirmatn font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
            >
              ثبت نام رستوران
            </Link>
            <Link 
              to='/login' 
              className="px-6 py-3 bg-transparent border border-white text-white font-vazirmatn font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-500 transition-all duration-200"
            >
              ورود / ورود آزمایشی
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-8 text-center">
          <h3 className="text-3xl font-bold font-vazirmatn">ویژگی‌های ما</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(feature => (
              <div key={feature.title} className="p-6 bg-white shadow-md rounded-lg">
                <h4 className="text-xl font-semibold m-2 font-vazirmatn">{feature.title}</h4>
                <img src={feature.image} alt={feature.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                <p className="text-gray-600 font-vazirmatn">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthLoader>
  );
}
