import { createContext, useContext, useState } from "react"
// import { FaHome } from "react-icons/fa";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom"
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
    //Navbar,
    Sidebar,
    Header
} from '../../components/dashboard/index'

export const loader = async()=>{
    try{
        const {data} =await customFetch.get('/users/current-user');
        return data;
    }
    catch(error){
        return redirect('/');
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
        await customFetch.get('/auth/logout');
        navigate('/');
        toast.success('خروج ...');
    }
    const toggleDarkTheme = async()=>{
        setIsDarkTheme(!isDarkTheme);
    }
    const toggleSidebar= async ()=>{
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
                <Header sidebarOpen={showSidebar} setSidebarOpen={toggleSidebar} />
                
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <Outlet context={{user}}/>
                        <h2 className="text-xl font-semibold text-right">خوش آمدید</h2>
                    </main>
                </div>
            </div>     
        </DashboardContext.Provider>
    )
}
export default Dashboard;
export const useDashboardContext = () => useContext(DashboardContext);