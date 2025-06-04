import { Link } from "react-router-dom";
import { features } from "./../assets/data";
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
        <section className="relative py-20 min-h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden rounded-3xl shadow-2xl mx-4 mt-4">
          {/* Modern restaurant with digital menu background */}
          <img
            src="/photos/hero-restaurant.jpeg"
            alt="رستوران مدرن با منوی دیجیتال"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60 z-0"
            style={{filter: 'blur(1px)'}}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-indigo-900/60 z-10" />
          <div className="relative z-20 container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Introduction Section - Right Side */}
              <div className="text-right space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">مدیریت هوشمند رستوران</h2>
                <p className="text-lg md:text-xl text-gray-100 font-light drop-shadow">
                  با زودمیز، مدیریت رستوران خود را به سطح جدیدی برسانید. سفارشات آنلاین، مدیریت منو، و گزارش‌گیری پیشرفته در یک پلتفرم یکپارچه.
                </p>
                {/* Slogans */}
                <div className="space-y-3">
                  <p className="text-xl md:text-2xl text-white font-semibold drop-shadow">تجربه‌ای نو از سفارش و رزرو</p>
                  <p className="text-xl md:text-2xl text-white font-semibold drop-shadow">همراه رستوران‌ها، راحتی مشتریان</p>
                </div>
              </div>
              {/* Links Section - Left Side */}
              <div className="text-right space-y-8">
                <div className="space-y-4">
                  <Link
                    to='/register'
                    className="block w-full px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                  >
                    ثبت نام رستوران
                  </Link>
                  <Link
                    to='/login'
                    className="block w-full px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                  >
                    ورود / ورود آزمایشی
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-16 text-gray-800">ویژگی‌های ما</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-16 text-gray-800">تعرفه‌های ما</h3>
            {/* Add your pricing content here */}
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-16 text-gray-800">تماس با ما</h3>
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