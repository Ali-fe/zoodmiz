import { Outlet} from "react-router-dom";
//import AuthRedirect from "../components/authredirect";

export default function HomeLayout() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 text-right font-vazirmatn">
            {/* <AuthRedirect /> */}
            <Outlet />
        </div>
    )
}