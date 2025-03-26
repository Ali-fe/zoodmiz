import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function HomeLayout() {
    return (
        <div  dir="rtl" className="min-h-screen bg-gray-100 text-gray-900 text-right font-vazirmatn">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}