import Edible from '../../types/edible';
import { useDashboardContext } from '../../pages/dashboard/dashboard';

const MenuItem = ({item}: {item:Edible}) => {
    const { isDarkTheme } = useDashboardContext();
    const discount = item.discount;
    const discountedPrice = discount>0?item.price-(item.price * discount/100):item.price;
    return (
        <div
        key={item._id}
        className={`overflow-hidden shadow-md transition hover:shadow-lg hover:scale-[1.02] ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
    >
        <img
            src={item.imageURL || '/photos/placeholder.png'}
            alt={item.name}
            className="w-full h-45 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm  mb-2">{item.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex-grow">{item.description}</p>
            <div className="mt-auto pt-2 text-right">
                {discount ? (
                    <div>
                        <p className="text-xs text-red-500 line-through">
                            {item.price.toLocaleString()}
                            <span className="text-xs mr-1">تومان</span>
                        </p>
                        <p className="text-xs font-bold text-green-500 dark:text-green-400">
                            {Math.round(discountedPrice).toLocaleString()}
                            <span className="text-xs mr-1">تومان</span>
                        </p>
                    </div>
                ) : (
                    <p className="text-xs font-bold text-green-500 dark:text-green-400">
                        {item.price.toLocaleString()}
                        <span className="text-xs mr-1">تومان</span>
                    </p>
                )}
            </div>
        </div>
    </div>
    )
}
export default MenuItem;