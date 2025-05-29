import { Outlet, useLocation } from "react-router-dom";
import AuthRedirect from "../components/AuthRedirect";

export default function HomeLayout() {
    const location = useLocation();
    const isPublicPage = !location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 text-right font-vazirmatn">
            {isPublicPage && <AuthRedirect />}
            <Outlet />
        </div>
    )
}