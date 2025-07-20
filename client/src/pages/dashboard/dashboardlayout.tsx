import { Outlet, useLocation } from "react-router-dom";
import Dashboard from "./dashboard";

const DashboardLayout = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname.endsWith("/login") ||
    location.pathname.endsWith("/register");

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Outlet />
      </div>
    );
  } else return (<Dashboard />);
};

export default DashboardLayout;
