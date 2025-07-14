import { createContext, useContext, useState, useEffect } from "react"
// import { FaHome } from "react-icons/fa";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom"
import customFetch from "../../utils/customFetch";
import { showToast } from "../../utils/toast";
import {
    Navbar,
    Sidebar
} from '../../components/dashboard/index'
import { User } from "../../types/user";
import Edible from '../../types/edible';
import { Order } from '../../hooks/useOrders';

interface CartItem extends Edible {
  quantity: number;
}

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

const defaultUser: Partial<User> = {};

interface DashboardContextType {
  user: Partial<User>;
  showSidebar: boolean;
  isDarkTheme: boolean;
  logoutUser: () => void;
  toggleDarkTheme: () => void;
  toggleSidebar: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  editingOrder: Order | null;
  setEditingOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const DashboardContext = createContext<DashboardContextType>({
    user: defaultUser,
    showSidebar: false,
    isDarkTheme: false,
    logoutUser: () => {},
    toggleDarkTheme: () => {},
    toggleSidebar: () => {},
    cart: [],
    setCart: () => {},
    searchQuery: '',
    setSearchQuery: () => {},
    editingOrder: null,
    setEditingOrder: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

function Dashboard() {
    const user = useLoaderData() as User;
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('darkTheme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
   
    useEffect(() => {
        localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
        if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkTheme]);
    
    const logoutUser = async () => {
        try {
            await customFetch.get('/auth/logout');
            navigate('/');
            showToast.success('خروج با موفقیت انجام شد');
        } catch (error) {
            showToast.error('خطا در خروج از حساب کاربری');
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
            toggleSidebar,
            cart,
            setCart,
            searchQuery,
            setSearchQuery,
            editingOrder,
            setEditingOrder
        }}>
            <div dir="rtl" className={`flex flex-col h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
                <Navbar />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className={`flex-1 p-4 overflow-y-auto ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
                        <Outlet context={{user}}/>
                    </main>
                </div>
            </div>
        </DashboardContext.Provider>
    )
}
export default Dashboard;