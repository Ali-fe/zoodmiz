import { Link } from "react-router-dom";
import { features } from "./../assets/data";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl mx-4 mt-4">
          <h2 className="text-4xl font-bold mb-4">به زودمیز خوش آمدید</h2>
          <p className="mt-3 text-lg font-light">تجربه ای نو از سفارش و رزرو</p>
          <p className="mt-3 text-lg font-light">همراه رستوران‌ها، راحتی مشتریان</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link 
              to='/register' 
              className="px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ثبت نام رستوران
            </Link>
            <Link 
              to='/login' 
              className="px-6 py-2.5 bg-transparent border-2 border-white text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ورود / ورود آزمایشی
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">ویژگی‌های ما</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">{feature.title}</h4>
                <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover rounded-xl mb-4 shadow-md" />
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
