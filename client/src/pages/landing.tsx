import { Link } from "react-router-dom";
import { useRef, useState, type RefObject } from "react";
import {
  FaBolt,
  FaBookOpen,
  FaCheckCircle,
  FaChevronDown,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQrcode,
  FaSearchLocation,
  FaShoppingBasket,
  FaTable,
  FaTachometerAlt,
  FaUtensils,
  FaUserPlus,
} from "react-icons/fa";
import { features, pricingPlans, testimonials } from "../data/data";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FeatureCard from "../components/featurecard";
import CoverArt from "../components/coverart";
import { useRestaurants, type Restaurant } from "../hooks/useCustomer";
import { toPersianNumber } from "../utils/persianNumbers";

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

const journeys = {
  restaurant: {
    label: "مسیر رستوران",
    hint: "از ساخت حساب تا دیدن اولین گزارش فروش.",
    steps: [
      {
        title: "حساب رستوران را بسازید",
        text: "نام، آدرس و شماره تماس را وارد کنید؛ پس از تایید شماره، پنل شما آماده است.",
        icon: <FaUserPlus />,
      },
      {
        title: "منو و میزها را بچینید",
        text: "دسته‌بندی‌های دلخواه، غذاها با قیمت و تصویر، و میزها با ظرفیت هر کدام.",
        icon: <FaUtensils />,
      },
      {
        title: "کیو‌آر هر میز را چاپ کنید",
        text: "هر میز لینک اختصاصی خودش را دارد؛ آن را روی میز بگذارید تا مشتری مستقیم به منوی همان میز برود.",
        icon: <FaQrcode />,
      },
      {
        title: "سفارش و رزرو را مدیریت کنید",
        text: "سفارش‌های ورودی، وضعیت میزها و گزارش فروش را لحظه‌ای در داشبورد ببینید.",
        icon: <FaTachometerAlt />,
      },
    ],
  },
  customer: {
    label: "مسیر مشتری",
    hint: "از پیدا کردن رستوران تا نشستن سر میز رزروشده.",
    steps: [
      {
        title: "رستوران نزدیک را پیدا کنید",
        text: "با جستجو یا موقعیت دستگاه، رستوران‌های اطراف را با فاصله‌شان ببینید.",
        icon: <FaSearchLocation />,
      },
      {
        title: "منوی به‌روز را ببینید",
        text: "قیمت‌ها و تصاویر همان لحظه از پنل رستوران تازه می‌شود؛ منوی کاغذی لازم نیست.",
        icon: <FaBookOpen />,
      },
      {
        title: "سفارش بدهید یا میز رزرو کنید",
        text: "از روی میز سفارش ثبت کنید یا برای تا چهارده روز آینده میز رزرو کنید.",
        icon: <FaShoppingBasket />,
      },
      {
        title: "راحت بنشینید",
        text: "ورود با شماره موبایل و رمز یک‌بارمصرف است و سفارش بی‌درنگ به آشپزخانه می‌رسد.",
        icon: <FaCheckCircle />,
      },
    ],
  },
};

const journeyOrder = ["restaurant", "customer"] as const;
type JourneyKey = (typeof journeyOrder)[number];

const faqs = [
  {
    q: "برای شروع نصب یا سخت‌افزار خاصی لازم است؟",
    a: "نه. همه‌چیز در مرورگر اجرا می‌شود؛ کافی است رستوران، منو و میزها را تعریف کنید. لینک منو و کیو‌آر هر میز از همان اول کار می‌کند و نیازی به دستگاه پوز یا نرم‌افزار جانبی نیست.",
  },
  {
    q: "مشتری برای سفارش دادن باید ثبت‌نام کند؟",
    a: "شماره موبایلش را وارد می‌کند و با رمز یک‌بارمصرف وارد می‌شود. همان لحظه سفارش در داشبورد رستوران می‌نشیند و دفعه بعد فقط با همان شماره وارد می‌شود.",
  },
  {
    q: "رزرو میز تا چند روز آینده ممکن است؟",
    a: "تا چهارده روز آینده و بر اساس ظرفیت هر میز. ساعت‌هایی که گذشته‌اند یا میزی در آن‌ها آزاد نیست، در انتخاب‌گر غیرفعال می‌شوند تا رزرو تکراری رخ ندهد.",
  },
  {
    q: "وضعیت میزها را کجا ببینم؟",
    a: "در صفحه میزهای داشبورد، هر میز با شماره، ظرفیت و برچسب آزاد، رزرو یا اشغال نمایش داده می‌شود و می‌توانید وضعیتش را دستی تغییر دهید.",
  },
  {
    q: "چند شعبه دارم، چطور مدیریتشان کنم؟",
    a: "برای زنجیره‌ها و رستوران‌های چندشعبه‌ای سطح ویژه را در نظر گرفته‌ایم؛ با ما تماس بگیرید تا ساختار دسترسی تیمی و نقش‌ها را با هم بچینیم.",
  },
  {
    q: "تعرفه‌ها چه‌طور پرداخت می‌شود؟",
    a: "قرارداد بلندمدت نداریم. می‌توانید از سطح پایه رایگان شروع کنید و هر زمان که خواستید سطح سرویس را عوض کنید.",
  },
];

const ctaLinkClass = (highlighted: boolean) =>
  `block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-all duration-300 ${
    highlighted
      ? "bg-white text-primary-700 hover:bg-primary-50"
      : "bg-primary text-white shadow-card hover:bg-primary-600 hover:shadow-lift"
  }`;

const featurePills = [
  { icon: <FaQrcode />, text: "کیو‌آر اختصاصی هر میز" },
  { icon: <FaTable />, text: "رزرو میز تا ۱۴ روز آینده" },
  { icon: <FaTachometerAlt />, text: "گزارش فروش لحظه‌ای" },
];

export default function Landing() {
  const featuresRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const [journey, setJourney] = useState<JourneyKey>("restaurant");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { restaurants, isLoading } = useRestaurants();
  const featured: Restaurant[] = (() => {
    const byName = new Map<string, Restaurant>();
    for (const restaurant of [...restaurants].sort((a, b) => a.name.localeCompare(b.name, "fa"))) {
      if (!byName.has(restaurant.name)) byName.set(restaurant.name, restaurant);
    }
    return Array.from(byName.values()).slice(0, 6);
  })();

  const scrollTo = (ref: RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const activeJourney = journeys[journey];

  return (
    <div className="min-h-screen bg-cream font-vazirmatn text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar
        onFeaturesClick={() => scrollTo(featuresRef)}
        onHowClick={() => scrollTo(howRef)}
        onPricingClick={() => scrollTo(pricingRef)}
        onFaqClick={() => scrollTo(faqRef)}
        onContactClick={() => scrollTo(contactRef)}
      />

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-bl from-primary-500 via-primary-600 to-accent pt-16">
        <img
          src="/photos/hero-restaurant.jpeg"
          alt="رستوران مدرن با منوی دیجیتال"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent" />
        <span className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
        <span className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />

        <div className="container relative mx-auto px-4 py-14 md:px-6 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
            <div className="animate-fade-up space-y-6 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur ring-1 ring-white/25">
                <FaBolt className="h-3 w-3" />
                سفارش، منو و رزرو میز در یک پنل
              </span>
              <h1 className="font-vazirmatn-title text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                منوی رستوران،{' '}
                <span className="inline-block rounded-xl bg-white/15 px-2 py-0.5 ring-1 ring-white/25">
                  روی میز
                </span>{' '}
                مشتری
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-primary-50/95 md:text-lg">
                زودمیز منوی دیجیتال، سفارش از روی میز و رزرو آنلاین را در یک پنل جمع می‌کند.
                خبری از منوی کاغذی نیست و هر تغییری همان لحظه روی میز مشتری تازه می‌شود.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/dashboard/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-primary-700 shadow-lift transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50 active:scale-[.98]"
                >
                  <FaUtensils className="h-3.5 w-3.5" />
                  ثبت‌نام رستوران
                </Link>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/35 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-[.98]"
                >
                  دیدن رستوران‌ها
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-bold text-white/90">
                {featurePills.map((pill) => (
                  <li key={pill.text} className="inline-flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3">
                    {pill.icon}
                    {pill.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* پیش‌نمای داشبورد */}
            <div className="animate-scale-in space-y-3" aria-hidden="true">
              <div className="rounded-3xl bg-white/95 p-4 shadow-lift backdrop-blur dark:bg-gray-800/95">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-100">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/15">
                      <FaTable className="h-3.5 w-3.5" />
                    </span>
                    میز ۳
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    سفارش تازه
                  </span>
                </div>
                <ul className="space-y-2 text-xs">
                  {[
                    { name: "چلو کباب کوبیده", qty: 1, price: "۳۲۰,۰۰۰" },
                    { name: "نوشیدنی", qty: 2, price: "۹۰,۰۰۰" },
                    { name: "سالاد سزار", qty: 1, price: "۱۴۵,۰۰۰" },
                  ].map((line) => (
                    <li
                      key={line.name}
                      className="flex items-baseline justify-between gap-2 border-b border-dashed border-gray-200 pb-2 last:border-0 dark:border-gray-700"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        {line.name}
                        <span className="ms-1 text-primary-600 dark:text-primary-300">
                          ×{toPersianNumber(line.qty)}
                        </span>
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {line.price}
                        <span className="ms-1 text-[10px] font-normal text-gray-400">تومان</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary-50 px-3 py-2.5 dark:bg-primary-500/10">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-300">جمع سفارش</span>
                  <span className="font-vazirmatn-title text-sm font-bold text-primary-700 dark:text-primary-300">
                    ۵۵۵,۰۰۰ تومان
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-3xl bg-white/80 p-3 shadow-card backdrop-blur dark:bg-gray-800/80">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ink to-ink-soft text-primary-300">
                  <FaQrcode className="h-7 w-7" />
                </span>
                <div className="min-w-0 text-xs">
                  <p className="font-bold text-gray-800 dark:text-gray-100">یک اسکن، مستقیم سر میز</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    لینک هر میز مشتری را به همان منو می‌برد؛ بدون جستجو و بدون نصب اپ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* نوار آمار */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="-mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-lift md:grid-cols-4 dark:border-gray-700 dark:bg-gray-800">
          {[
            {
              value: isLoading ? "…" : `${toPersianNumber(restaurants.length)}+`,
              label: "رستوران روی زودمیز",
            },
            { value: "رایگان", label: "سطح پایه، بدون قرارداد" },
            { value: "۱۴ روز", label: "پنجره رزرو میز" },
            { value: "لحظه‌ای", label: "سفارش، میز و گزارش" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-vazirmatn-title text-lg font-bold text-primary-600 dark:text-primary-300">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="container mx-auto space-y-16 px-4 py-14 md:px-6 md:py-16">
        {/* Features */}
        <section ref={featuresRef} className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              ویژگی‌ها
            </span>
            <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
              هرچه رستوران برای یک شب شلوغ لازم دارد
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              از چیدن منو تا تحویل سفارش به آشپزخانه؛ همه در همزبان خود مشتری و در همان پنلی که مدیریت می‌کنید.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section ref={howRef} className="scroll-mt-24 rounded-3xl bg-white p-5 shadow-card md:p-8 dark:bg-gray-800">
          <div className="mb-6 flex flex-col items-center gap-4 text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
                مسیر کار
              </span>
              <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                چهار قدم، از دو سو
              </h2>
            </div>
            <div
              role="tablist"
              className="inline-flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-700"
            >
              {journeyOrder.map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={journey === key}
                  onClick={() => setJourney(key)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    journey === key
                      ? "bg-primary text-white shadow-card"
                      : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-300"
                  }`}
                >
                  {journeys[key].label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{activeJourney.hint}</p>
          </div>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {activeJourney.steps.map((step, index) => (
              <li
                key={step.title}
                style={{ animationDelay: `${index * 80}ms` }}
                className="group animate-fade-up relative rounded-2xl border border-gray-100 bg-cream/60 p-4 transition-colors duration-300 hover:border-primary-200 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-primary-500/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-card [&>svg]:h-4 [&>svg]:w-4">
                    {step.icon}
                  </span>
                  <span className="font-vazirmatn-title text-2xl font-bold text-primary-100 dark:text-primary-500/20">
                    {toPersianNumber(index + 1)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* رستوران‌های منتخب */}
        {!isLoading && featured.length > 0 && (
          <section className="scroll-mt-24">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
                  همین حالا آنلاین‌اند
                </span>
                <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
                  رستوران‌های منتخب
                </h2>
              </div>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 px-3.5 py-2 text-xs font-bold text-primary-700 transition-colors duration-200 hover:bg-primary-50 dark:border-primary-500/30 dark:text-primary-300 dark:hover:bg-primary-500/10"
              >
                همه رستوران‌ها را ببینید
                <FaChevronDown className="h-2.5 w-2.5 -rotate-90" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((restaurant, index) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/menu/${restaurant._id}/0`}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className="group flex animate-fade-up items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lift dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500/30"
                >
                  <CoverArt
                    name={restaurant.name}
                    src={restaurant.image}
                    className="h-16 w-16 shrink-0 rounded-2xl"
                    textClass="text-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-gray-800 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-300">
                      {restaurant.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {restaurant.description || "منوی دیجیتال این رستوران را ببینید."}
                    </p>
                    {restaurant.address?.city && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                        <FaMapMarkerAlt className="h-2 w-2" />
                        {restaurant.address.city}
                      </span>
                    )}
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gray-50 text-gray-400 transition-colors duration-200 group-hover:bg-primary group-hover:text-white dark:bg-gray-700 dark:text-gray-400">
                    <FaUtensils className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              نظرها
            </span>
            <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
              مشتریان درباره ما چه می‌گویند
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.name}
                style={{ animationDelay: `${index * 80}ms` }}
                className="flex animate-fade-up flex-col gap-3 rounded-3xl border border-transparent bg-white p-5 shadow-card transition-all duration-300 hover:border-primary-200 hover:shadow-lift dark:bg-gray-800 dark:hover:border-primary-500/30"
              >
                <span className="font-vazirmatn-title text-3xl leading-none text-primary-200 dark:text-primary-500/30">
                  ”
                </span>
                <blockquote className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {testimonial.feedback}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-dashed border-gray-200 pt-3 dark:border-gray-700">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-accent font-vazirmatn-title text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                      {testimonial.name}
                    </span>
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.position}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section ref={pricingRef} className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              تعرفه‌ها
            </span>
            <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
              تعرفه‌های ما
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              بدون قرارداد بلندمدت؛ هر زمان می‌توانید سطح سرویس را تغییر دهید.
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col gap-4 rounded-3xl p-5 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-bl from-primary-500 via-primary-600 to-accent text-white shadow-lift md:-translate-y-3"
                    : "border border-gray-100 bg-white text-gray-800 shadow-card hover:shadow-lift dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-vazirmatn-title text-base font-bold">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-700">
                      محبوب‌ترین
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-vazirmatn-title text-2xl font-bold">{plan.price}</p>
                  {plan.period && (
                    <p className={`mt-1 text-xs ${plan.highlighted ? "text-primary-50/90" : "text-gray-500 dark:text-gray-400"}`}>
                      {plan.period}
                    </p>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-primary-50/90" : "text-gray-600 dark:text-gray-300"}`}>
                  {plan.description}
                </p>
                <ul className="flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <FaCheckCircle
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          plan.highlighted ? "text-white" : "text-primary-500 dark:text-primary-300"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.href.startsWith("mailto:") ? (
                  <a href={plan.href} className={ctaLinkClass(plan.highlighted)}>
                    {plan.cta}
                  </a>
                ) : (
                  <Link to={plan.href} className={ctaLinkClass(plan.highlighted)}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              پرسش‌ها
            </span>
            <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
              هرچه لازم است بدانید
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 dark:bg-gray-800 ${
                    isOpen ? "border-primary-200 shadow-card dark:border-primary-500/30" : "border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right"
                  >
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{faq.q}</span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-180 bg-primary text-white" : "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
                      }`}
                    >
                      <FaChevronDown className="h-3 w-3" />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="animate-fade-up border-t border-dashed border-gray-200 px-4 py-3 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-300">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section ref={contactRef} className="scroll-mt-24">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              تماس
            </span>
            <h2 className="mt-2 font-vazirmatn-title text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-100">
              تماس با ما
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              برای راه‌اندازی، دموی حضوری یا پرسش‌های فنی با ما در ارتباط باشید.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.title}
                className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:bg-gray-800 dark:border-gray-700"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600 [&>svg]:h-4 [&>svg]:w-4 dark:bg-primary-500/15 dark:text-primary-300">
                  {contact.icon}
                </span>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{contact.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{contact.subtitle}</p>
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="break-all text-sm font-bold text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300"
                    dir={contact.ltr ? "ltr" : undefined}
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{contact.value}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* فراخوان آخر */}
        <section className="relative overflow-hidden rounded-3xl bg-ink px-5 py-10 text-center shadow-lift md:px-8">
          <span className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary-500/25 blur-3xl" />
          <span className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative mx-auto max-w-2xl space-y-4">
            <h2 className="font-vazirmatn-title text-2xl font-bold text-white md:text-3xl">
              امشب منوی رستورانت را روی میز بگذار
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">
              ثبت‌نام کنید، سه غذا و سه میز تعریف کنید و لینک منو را چاپ کنید؛ بقیه‌اش با مشتری.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link
                to="/dashboard/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-500 active:scale-[.98]"
              >
                <FaUserPlus className="h-3.5 w-3.5" />
                شروع رایگان
              </Link>
              <Link
                to="/dashboard/login"
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:scale-[.98]"
              >
                ورود به پنل
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onFeaturesClick={() => scrollTo(featuresRef)}
        onHowClick={() => scrollTo(howRef)}
        onPricingClick={() => scrollTo(pricingRef)}
        onFaqClick={() => scrollTo(faqRef)}
        onContactClick={() => scrollTo(contactRef)}
      />
    </div>
  );
}
