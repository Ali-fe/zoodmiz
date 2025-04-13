import { Link } from "react-router-dom";
import { features } from "./../assets/data"

export default function Landing() {
  return (
    <div className="pt-25">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-500 text-white rounded-lg shadow-lg mx-6 mt-6">
        <h2 className="text-5xl ">به زودمیز خوش آمدید</h2>
        <p className="mt-4 text-xl">تجربه ای نو از سفارش و رزرو</p>
        <p className="mt-4 text-xl">همراه رستوران‌ها، راحتی مشتریان</p>
        <div className="mt-6 flex justify-center space-x-2">
          <Link to='/register' className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-200">
            ثبت نام رستوران
          </Link>
          <Link to='/login' className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-500">
            ورود / ورود آزمایشی
          </Link>
         
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 text-center">
        <h3 className="text-3xl font-bold">ویژگی‌های ما</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            features.map(feature =>
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h4 className="text-xl font-semibold m-2"> {feature.title}</h4>
                <img src={feature.image} alt={feature.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                <p className="text-gray-600">{feature.description}</p>
              </div>)
          }
        </div>
      </section>
    </div>
  );
}
