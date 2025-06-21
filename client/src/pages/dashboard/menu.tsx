

import { useEffect, useState } from 'react';
import customFetch from '../../utils/customFetch';
import { useDashboardContext } from './dashboard';
import { FaSpinner } from 'react-icons/fa';
import { showToast } from '../../utils/toast';
import Edible from '../../types/edible';
import MenuItem from '../../components/dashboard/menuitem';

const Menu = () => {
    const { isDarkTheme } = useDashboardContext();
    const [edibles, setEdibles] = useState<Edible[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEdibles = async () => {
            try {
                const { data } = await customFetch.get('/edibles');
                setEdibles(data.edibles);
            } catch (error) {
                showToast.error('خطا در دریافت لیست خوراکی ها');
            } finally {
                setLoading(false);
            }
        };
        fetchEdibles();
    }, []);


    return (
        <div className="p-6">
            <h2 className={`text-l font-bold mb-6 text-right ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                منوی رستوران
            </h2>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <FaSpinner className="animate-spin text-3xl text-blue-500" />
                </div>
            ) : edibles.length === 0 ? (
                <p className={`text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    هیچ آیتمی در منو وجود ندارد.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {edibles.map(item => (
                        item.menu &&
                        <MenuItem item={item}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;