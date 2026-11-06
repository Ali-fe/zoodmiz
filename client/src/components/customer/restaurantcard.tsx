import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaTable, FaUtensils } from "react-icons/fa";
import type { Restaurant } from "../../hooks/useCustomer";
import CoverArt from "../coverart";

interface RestaurantCardProps {
  restaurant: Restaurant;
  to?: string; // مسیر صفحه منو رستوران
  distanceLabel?: string;
  onReserve?: (restaurant: Restaurant) => void;
}

const RestaurantCard = ({ restaurant, to, distanceLabel, onReserve }: RestaurantCardProps) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift dark:border-gray-700 dark:bg-gray-800">
      <div className="relative">
        <CoverArt
          name={restaurant.name}
          src={restaurant.image}
          className="h-40 w-full"
          textClass="text-4xl"
        />
        {distanceLabel && (
          <span className="absolute bottom-2 start-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-card backdrop-blur">
            <FaMapMarkerAlt className="h-2.5 w-2.5" />
            {distanceLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-800 font-vazirmatn-title dark:text-gray-100">
          {restaurant.name}
        </h3>

        {restaurant.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{restaurant.description}</p>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">برای این رستوران توضیحی ثبت نشده است.</p>
        )}

        <div className="mt-auto space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
            {restaurant.address?.city && (
              <span className="inline-flex items-center gap-1">
                <FaMapMarkerAlt className="h-2.5 w-2.5 text-primary-500" />
                {restaurant.address.city}
              </span>
            )}
            {restaurant.address?.street && (
              <span className="inline-flex items-center gap-1">
                <FaUtensils className="h-2.5 w-2.5 text-gray-300 dark:text-gray-600" />
                {restaurant.address.street}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {to && (
              <Link
                to={to}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-card transition-all duration-200 hover:bg-primary-600 active:scale-[.98]"
              >
                <FaUtensils className="h-3 w-3" />
                مشاهده منو
              </Link>
            )}
            {onReserve && (
              <button
                type="button"
                onClick={() => onReserve(restaurant)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary-200 px-3.5 py-2 text-xs font-bold text-primary-700 transition-all duration-200 hover:bg-primary-50 active:scale-[.98] dark:border-primary-500/30 dark:text-primary-300 dark:hover:bg-primary-500/10"
              >
                <FaTable className="h-3 w-3" />
                رزرو میز
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
