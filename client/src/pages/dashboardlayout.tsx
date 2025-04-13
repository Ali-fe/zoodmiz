import { createContext, useContext, useState } from "react"
// import { FaHome } from "react-icons/fa";
import { Outlet } from "react-router-dom"

const DashboardContext = createContext({
    user: {},
    showSidebar: false,
    isDarkTheme: false,
    logoutUser: () => {},
    toggleDarkTheme: () => {},
    toggleSidebar: () => {}
  });

function DashboardLayout() {
    const user = { name: 'ali' };
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const logoutUser = async () => {
        console.log('logout user');
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
           
            <Outlet />
        </DashboardContext.Provider>
    )
}
export default DashboardLayout;
export const useDashboardContext = () => useContext(DashboardContext);