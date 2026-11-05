import { Link } from "react-router-dom";
import { useRef } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { features, pricingPlans, testimonials } from "../data/data";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FeatureCard from "../components/featurecard";

const planCtaClass = (highlighted: boolean) =>
  `block w-full px-4 py-2.5 rounded-xl text-center text-sm font-bold transition-all duration-300 ${
    highlighted ? "bg-white text-blue-900 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"
  }`;

const contacts = [
  {
    title: "تلفن",
    subtitle: "شماره ثابت و همراه",
    value: "۰۸۱-۴۲۵۳۰۶۰ · ۰۹۱۸۷۱۱۴۲۸۲",
    href: "tel:+98814253060",
    ltr: true,
    icon: <FaPhoneAlt />,
  },
  {
    title: "ایمیل",
    subtitle: "پشتیبانی و همکاری",
    value: "info@zoodmiz.ir",
    href: "mailto:info@zoodmiz.ir",
    ltr: true,
    icon: <FaEnvelope />,
  },
  {
    title: "آدرس",
    subtitle: "مرکز نوآوری و شتابدهی کندو، طبقه دوم",
    value: "همدان، دانشگاه بوعلی سینا",
    href: "",
    ltr: false,
    icon: <FaMapMarkerAlt />,
  },
];

export default function Landing() {
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar
        onFeaturesClick={scrollToFeatures}
        onPricingClick={scrollToPricing}
        onContactClick={scrollToContact}
      />
      <div className="pt-20 py-20">
        {/* Hero Section */}
     
       
        <div className="relative py-12 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-700 overflow-hidden rounded-2xl shadow-xl mx-2 mt-2">
          {/* Modern restaurant with digital menu background */}
          <img
            src="/photos/hero-restaurant.jpeg"
            alt="رستوران مدرن با منوی دیجیتال"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 z-0"
            style={{ filter: "blur(2px) grayscale(30%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-indigo-900/70 z-10" />
          <div className="relative z-20 container mx-auto flex px-10 ">
          <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Introduction Section - Right Side */}
              <div className="text-right space-y-5">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-xl tracking-tight">
                  مدیریت هوشمند رستوران
                </h2>
                <p className="text-base md:text-lg text-blue-100 font-light drop-shadow-md leading-relaxed">
                  با زودمیز، مدیریت رستوران خود را به سطح جدیدی برسانید.
                  <br />
                  سفارشات آنلاین، مدیریت منو و گزارش‌گیری پیشرفته در یک پلتفرم
                  یکپارچه.
                </p>
                {/* Slogans */}
                <div className="space-y-1">
                  <p className="text-base md:text-lg text-emerald-300 font-bold drop-shadow">
                    {"تجربه‌ای نو از سفارش و رزرو"}
                  </p>
                  <p className="text-base md:text-lg text-emerald-200 font-bold drop-shadow">
                    {"همراه رستوران‌ها، راحتی مشتریان"}
                  </p>
                </div>
              </div>
              {/* Links Section - Left Side */}
              <div className="text-right space-y-6">
                <div className="space-y-3">
                  <Link
                    to="/dashboard/register"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold rounded-xl shadow-xl hover:shadow-emerald-200/40 hover:from-emerald-500 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 text-center text-base tracking-wide"
                  >
                    ثبت نام رستوران
                  </Link>
                  <Link
                    to="/dashboard/login"
                    className="block w-full px-6 py-3 bg-white/10 border border-white/30 text-white font-bold rounded-xl shadow-xl hover:shadow-blue-200/40 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-center text-base tracking-wide backdrop-blur-md"
                  >
                    ورود / ورود آزمایشی
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Features Section */}
        <section
          ref={featuresRef}
          className="py-12 px-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        >
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-10 text-gray-800">
              ویژگی‌های ما
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 px-2 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-10 text-gray-800">
              مشتریان درباره ما چه می‌گویند
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4 border border-transparent hover:border-blue-100 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{testimonial.position}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{testimonial.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-12 px-2 bg-white">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
              تعرفه‌های ما
            </h3>
            <p className="text-sm text-center text-gray-500 mb-10">
              بدون قرارداد بلندمدت؛ هر زمان می‌توانید سطح سرویس را تغییر دهید.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-700 text-white shadow-2xl md:-translate-y-2"
                      : "bg-gray-50 text-gray-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold">{plan.name}</h4>
                    {plan.highlighted && (
                      <span className="text-[11px] font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                        محبوب‌ترین
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">{plan.price}</p>
                    {plan.period && (
                      <p className={`text-xs mt-1 ${plan.highlighted ? "text-blue-100" : "text-gray-500"}`}>
                        {plan.period}
                      </p>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-blue-100" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${plan.highlighted ? "bg-emerald-300" : "bg-blue-500"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.href.startsWith("mailto:") ? (
                    <a href={plan.href} className={planCtaClass(plan.highlighted)}>
                      {plan.cta}
                    </a>
                  ) : (
                    <Link to={plan.href} className={planCtaClass(plan.highlighted)}>
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-12 px-2 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
              تماس با ما
            </h3>
            <p className="text-sm text-center text-gray-500 mb-10">
              برای راه‌اندازی، دموی حضوری یا پرسش‌های فنی با ما در ارتباط باشید.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.title}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center gap-3 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    {contact.icon}
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">{contact.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{contact.subtitle}</p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 break-all"
                      dir={contact.ltr ? "ltr" : undefined}
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-gray-700">{contact.value}</p>
                  )}
                </div>
              ))}
            </div>
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
