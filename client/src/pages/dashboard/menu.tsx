import { useDashboardContext } from './dashboard';
import { FaSpinner } from 'react-icons/fa';
import MenuItem from '../../components/dashboard/menuitem';
import { useMenu } from '../../hooks/useEdibles';
import { useMemo, useState, useRef, useEffect } from 'react';
import Edible from '../../types/edible';

const Menu = () => {
    const { isDarkTheme } = useDashboardContext();
    const { data: edibles = [], isLoading, isError, error } = useMenu();
    const [activeCategory, setActiveCategory] = useState<string>('');

    const mainContentRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const groupedEdibles = useMemo(() => {
        if (!edibles) return {};
        return edibles.reduce((acc, edible) => {
            const { type } = edible;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(edible);
            return acc;
        }, {} as Record<string, Edible[]>);
    }, [edibles]);

    useEffect(() => {
        const firstCategory = Object.keys(groupedEdibles)[0];
        if (firstCategory && !activeCategory) {
            setActiveCategory(firstCategory);
        }
    }, [groupedEdibles, activeCategory]);

    useEffect(() => {
        const handleScroll = () => {
            const mainContent = mainContentRef.current;
            if (!mainContent) return;

            const scrollPosition = mainContent.scrollTop;
            let currentCategory = '';
            // Offset to trigger highlight a bit before the section hits the top
            const offset = 120; 

            const categories = Object.keys(categoryRefs.current);

            for (const category of categories) {
                const ref = categoryRefs.current[category];
                if (ref && (ref.offsetTop - offset) <= scrollPosition) {
                    currentCategory = category;
                }
            }

            if (currentCategory && currentCategory !== activeCategory) {
                setActiveCategory(currentCategory);
            }
        };

        const contentElement = mainContentRef.current;
        contentElement?.addEventListener('scroll', handleScroll);
        return () => {
            contentElement?.removeEventListener('scroll', handleScroll);
        };
    }, [activeCategory, groupedEdibles]);

    const handleCategoryClick = (category: string) => {
        const mainContent = mainContentRef.current;
        const categoryElement = categoryRefs.current[category];
        if (mainContent && categoryElement) {
            const top = categoryElement.offsetTop - 20; // small offset
            mainContent.scrollTo({
                top: top,
                behavior: 'smooth',
            });
            setActiveCategory(category);
        }
    };

    return (
        <div className="flex flex-row h-full">
            {/* Sidebar */}
            <aside className={`w-35 p-4 flex-shrink-0 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <h2 className={`text-sm font-bold mb-4 text-right sticky top-0 py-2 ${isDarkTheme ? 'text-white bg-gray-900' : 'text-gray-800 bg-gray-100'}`}>
                    منو
                </h2>
                <ul className="space-y-2 text-right">
                    {Object.keys(groupedEdibles).map(category => (
                        <li key={category}>
                            <button
                                onClick={() => handleCategoryClick(category)}
                                className={`w-full text-sm text-right px-3 py-2 rounded-md transition-all duration-200 ${activeCategory === category
                                        ? 'bg-amber-500 text-white font-bold shadow-lg'
                                        : isDarkTheme
                                            ? 'text-gray-300 hover:bg-gray-700'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            {/* Main Content */}
            <main ref={mainContentRef} className="flex-grow p-6 overflow-y-auto">
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <FaSpinner className="animate-spin text-3xl text-blue-500" />
                    </div>
                ) : isError ? (
                    <p className={`text-center text-red-500`}>
                        خطا در بارگذاری منو: {error?.message}
                    </p>
                ) : Object.keys(groupedEdibles).length === 0 ? (
                    <p className={`text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        هیچ آیتمی در منو وجود ندارد.
                    </p>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedEdibles).map(([type, items]) => (
                            <div key={type} ref={el => { categoryRefs.current[type] = el; }}>
                                <h3 className={`text-sm font-bold mb-4 pb-1 border-b-2 text-right ${isDarkTheme ? 'border-gray-700 text-amber-300' : 'border-gray-200 text-amber-600'}`}>
                                    {type}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                    {items.map(item => (
                                        <MenuItem key={item._id} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            
        </div>
    );
};

export default Menu;