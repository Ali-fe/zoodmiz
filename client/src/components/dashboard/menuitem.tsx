import Edible from '../../types/edible';
import { useDashboardContext } from '../../pages/dashboard/dashboard';

const MenuItem = ({item}: {item:Edible}) => {
    const { isDarkTheme } = useDashboardContext();

    return (
        <div
        key={item._id}
        className={`rounded-xl overflow-hidden shadow-md transition hover:shadow-lg hover:scale-[1.02] ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
    >
        <img
            src={item.imageURL || '/photos/placeholder.png'}
            alt={item.name}
            className="w-full h-50 object-cover"
        />
        <div className="p-4">
            <h3 className="text-sm font-bold mb-1">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.type}</p>
            <p className="text-green-500 dark:text-green-400">
                {item.price.toLocaleString()} تومان
            </p>
        </div>
    </div>
    )
}
export default MenuItem;