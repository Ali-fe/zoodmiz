import { FaHome, FaInfoCircle, FaPhone, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md p-4 fixed top-0 w-full z-50" dir="rtl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/photos/zoodmiz.svg" alt="زودمیز" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-primary font-vazirmatn">زودمیز</h1>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-6 text-lg font-vazirmatn">
            <li>
              <a 
                href="#features" 
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaHome className="text-xl" />
                <span>ویژگی‌ها</span>
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaInfoCircle className="text-xl" />
                <span>درباره ما</span>
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaPhone className="text-xl" />
                <span>تماس با ما</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200 font-vazirmatn"
          >
            <FaUserCircle className="text-xl" />
            <span>ورود</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
