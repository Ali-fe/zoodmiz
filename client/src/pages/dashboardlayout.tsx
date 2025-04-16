import { createContext, useContext, useState } from "react"
// import { FaHome } from "react-icons/fa";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom"
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
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

function DashboardLayout() {
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
            <h1> dashboard layout</h1>
            <button onClick={logoutUser} type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
            خروج
          </button>

            <Outlet context={{user}}/>
        </DashboardContext.Provider>
    )
}
export default DashboardLayout;
export const useDashboardContext = () => useContext(DashboardContext);