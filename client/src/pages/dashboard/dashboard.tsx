import { createContext, useContext, useState } from "react"
// import { FaHome } from "react-icons/fa";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom"
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
    Navbar,
    Sidebar
} from '../../components/dashboard/index'

export const loader = async () => {
    try {
        const { data } = await customFetch.get('/users/current-user');
        return data;
    } catch (error: any) {
        throw {
            message: 'لطفا ابتدا وارد حساب کاربری خود شوید',
            status: error?.response?.status || 401,
            statusText: error?.response?.statusText || 'Unauthorized'
        };
    }
}

const DashboardContext = createContext({
    user: {},
    showSidebar: false,
    isDarkTheme: false,
    logoutUser: () => {},
    toggleDarkTheme: () => {},
    toggleSidebar: () => {}
});

function Dashboard() {
    const user = useLoaderData();
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    
    const logoutUser = async () => {
        try {
            await customFetch.get('/auth/logout');
            navigate('/');
            toast.success('خروج با موفقیت انجام شد');
        } catch (error) {
            toast.error('خطا در خروج از حساب کاربری');
        }
    }
    
    const toggleDarkTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    }
    
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    return (
        <DashboardContext.Provider value={{
            user,
            showSidebar,
            isDarkTheme,
            logoutUser,
            toggleDarkTheme,
            toggleSidebar
        }}>
            <div dir="rtl" className="flex flex-col h-screen">
               
                <Navbar />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <Outlet context={{user}}/>
                    </main>
                </div>
            </div>     
        </DashboardContext.Provider>
    )
}
export default Dashboard;
export const useDashboardContext = () => useContext(DashboardContext);