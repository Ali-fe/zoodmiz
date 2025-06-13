import { Link } from "react-router-dom";
import { features } from "../data/data";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useRef } from "react";

export default function Landing() {
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar 
        onFeaturesClick={scrollToFeatures}
        onPricingClick={scrollToPricing}
        onContactClick={scrollToContact}
      />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-12 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-700 overflow-hidden rounded-2xl shadow-xl mx-2 mt-2">
          {/* Modern restaurant with digital menu background */}
          <img
            src="/photos/hero-restaurant.jpeg"
            alt="رستوران مدرن با منوی دیجیتال"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 z-0"
            style={{ filter: 'blur(2px) grayscale(30%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-indigo-900/70 z-10" />
          <div className="relative z-20 container mx-auto px-3">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Introduction Section - Right Side */}
              <div className="text-right space-y-5">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-xl tracking-tight">
                  مدیریت هوشمند رستوران
                </h2>
                <p className="text-base md:text-lg text-blue-100 font-light drop-shadow-md leading-relaxed">
                  با زودمیز، مدیریت رستوران خود را به سطح جدیدی برسانید.<br />
                  سفارشات آنلاین، مدیریت منو، و گزارش‌گیری پیشرفته در یک پلتفرم یکپارچه.
                </p>
                {/* Slogans */}
                <div className="space-y-1">
                  <p className="text-base md:text-lg text-emerald-300 font-bold drop-shadow">{'تجربه‌ای نو از سفارش و رزرو'}</p>
                  <p className="text-base md:text-lg text-emerald-200 font-bold drop-shadow">{'همراه رستوران‌ها، راحتی مشتریان'}</p>
                </div>
              </div>
              {/* Links Section - Left Side */}
              <div className="text-right space-y-6">
                <div className="space-y-3">
                  <Link
                    to='/register'
                    className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold rounded-xl shadow-xl hover:shadow-emerald-200/40 hover:from-emerald-500 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 text-center text-base tracking-wide"
                  >
                    ثبت نام رستوران
                  </Link>
                  <Link
                    to='/login'
                    className="block w-full px-6 py-3 bg-white/10 border border-white/30 text-white font-bold rounded-xl shadow-xl hover:shadow-blue-200/40 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-center text-base tracking-wide backdrop-blur-md"
                  >
                    ورود / ورود آزمایشی
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-12 px-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-10 text-gray-800">ویژگی‌های ما</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="text-base font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-12 px-2 bg-white">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-10 text-gray-800">تعرفه‌های ما</h3>
            {/* Add your pricing content here */}
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-12 px-2 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-10 text-gray-800">تماس با ما</h3>
            {/* Add your contact content here */}
          </div>
        </section>
      </div>
      <Footer 
        onFeaturesClick={scrollToFeatures}
        onPricingClick={scrollToPricing}
        onContactClick={scrollToContact}
      />
    </div>
  );
}