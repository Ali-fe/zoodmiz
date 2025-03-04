import { Link } from "react-router-dom";


export default function Landing() {
  return (
    <>
       {/* Hero Section */}
       <section className="text-center py-20 bg-blue-500 text-white rounded-lg shadow-lg mx-6 mt-6">
        <h2 className="text-5xl ">به نام برند خوش آمدید</h2>
        <p className="mt-4 text-xl">یک شعار کوتاه و جذاب که خدمات شما را توصیف می‌کند.</p>
        <div className="mt-6 flex justify-center space-x-2">
          <Link to='/register' className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-200">
            ثبت نام
          </Link>
          <Link to='/login' className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-500">
            وارد شوید
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 px-8 text-center">
        <h3 className="text-3xl font-bold">ویژگی‌های ما</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <img src="/feature1.png" alt="ویژگی اول" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h4 className="text-xl font-semibold">ویژگی اول</h4>
            <p className="text-gray-600">توضیحی درباره ویژگی اول.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <img src="/feature2.png" alt="ویژگی دوم" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h4 className="text-xl font-semibold">ویژگی دوم</h4>
            <p className="text-gray-600">توضیحی درباره ویژگی دوم.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <img src="/feature3.png" alt="ویژگی سوم" className="w-full h-40 object-cover rounded-lg mb-4" />
            <h4 className="text-xl font-semibold">ویژگی سوم</h4>
            <p className="text-gray-600">توضیحی درباره ویژگی سوم.</p>
          </div>
        </div>
      </section>
  </>
  );
}
