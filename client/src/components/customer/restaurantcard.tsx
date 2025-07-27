import { Link } from "react-router-dom";

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  imageURL?: string;
  address?: {
    city?: string;
    street?: string;
  };
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  to?: string; // مسیر صفحه منو رستوران
}

const RestaurantCard = ({ restaurant, to }: RestaurantCardProps) => {
  return (
    <div className="relative group transition-transform rounded-2xl p-2 flex gap-4 items-center min-h-[120px] bg-white">
      {/* تصویر */}
      <div className="flex flex-col justify-center items-center h-full">
        {restaurant.imageURL ? (
          <img
            src={restaurant.imageURL}
            alt={restaurant.name}
            className="w-40 h-40 object-cover rounded-xl flex-shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-40 h-40 rounded-xl flex-shrink-0 bg-gray-100"></div>
        )}
      </div>
      {/* اطلاعات */}
      <div className="flex-1 flex flex-col gap-2 justify-between h-full">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{restaurant.name}</h3>
        {restaurant.description && (
          <p className="text-xs line-clamp-2 text-gray-500">{restaurant.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {restaurant.address?.city && <span>شهر: {restaurant.address.city}</span>}
          {restaurant.address?.street && <span>آدرس: {restaurant.address.street}</span>}
        </div>
        <div className="flex items-center gap-2 mt-3">
          {to ? (
            <Link
              to={to}
              className="px-4 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600 transition font-bold"
            >
              مشاهده منو
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 