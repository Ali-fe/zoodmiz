import { Link } from "react-router-dom";
import { features } from "./../assets/data";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <div className="pt-25">
        {/* Hero Section */}
        <section className="text-center py-20 bg-blue-500 text-white rounded-lg shadow-lg mx-6 mt-6">
          <h2 className="text-5xl">به زودمیز خوش آمدید</h2>
          <p className="mt-4 text-xl">تجربه ای نو از سفارش و رزرو</p>
          <p className="mt-4 text-xl">همراه رستوران‌ها، راحتی مشتریان</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link 
              to='/register' 
              className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
            >
              ثبت نام رستوران
            </Link>
            <Link 
              to='/login' 
              className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-500 transition-all duration-200"
            >
              ورود / ورود آزمایشی
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <h3 className="text-3xl font-bold text-center mb-12">ویژگی‌های ما</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-xl font-semibold m-2">{feature.title}</h4>
                <img src={feature.image} alt={feature.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
