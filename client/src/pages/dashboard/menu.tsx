import { useDashboardContext } from './dashboard';
import { FaSpinner } from 'react-icons/fa';
import MenuItem from '../../components/dashboard/menuitem';
import { useMenu } from '../../hooks/useEdibles';

const Menu = () => {
    const { isDarkTheme } = useDashboardContext();
    const { data: edibles = [], isLoading, isError, error } = useMenu();

    return (
        <div className="p-6">
            <h2 className={`text-l font-bold mb-6 text-right ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                منوی رستوران
            </h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-3xl text-blue-500" />
                </div>
            ) : isError ? (
                <p className={`text-center text-red-500`}>
                    خطا در بارگذاری منو: {error?.message}
                </p>
            ) : edibles.length === 0 ? (
                <p className={`text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    هیچ آیتمی در منو وجود ندارد.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {edibles.map(item => (
                        <MenuItem key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;