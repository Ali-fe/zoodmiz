import { useRestaurants } from '../../hooks/useCustomer';
import RestaurantCard from '../../components/customer/restaurantcard';

const Restaurants = () => {
    const { restaurants, isLoading, error } = useRestaurants();
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">خطا در دریافت لیست رستوران‌ها</div>;
    }
    return (
        <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
                <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    to={`/restaurants/menu/${restaurant._id}/0`}
                />
            ))}
        </div>
    );
}

export default Restaurants;