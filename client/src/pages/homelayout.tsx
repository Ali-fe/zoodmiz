import { Outlet} from "react-router-dom";
//import AuthRedirect from "../components/authredirect";

export default function HomeLayout() {
    return (
        <div className="min-h-screen bg-cream font-vazirmatn text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {/* <AuthRedirect /> */}
            <Outlet />
        </div>
    )
}