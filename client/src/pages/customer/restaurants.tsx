import { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaSpinner, FaTable } from 'react-icons/fa';
import { useCustomerContext } from '../../pages/customer/customerlayout';
import { useRestaurants, type Restaurant } from '../../hooks/useCustomer';
import RestaurantCard from '../../components/customer/restaurantcard';
import ReservationModal from '../../components/customer/ReservationModal';
import { distanceKm, formatDistance } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';

type SortMode = 'name' | 'nearby';

const Restaurants = () => {
    const { restaurants, isLoading, error } = useRestaurants();
    const { uiState, updateUiState } = useCustomerContext();
    const [city, setCity] = useState('');
    const [sort, setSort] = useState<SortMode>('name');
    const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);
    const [locateError, setLocateError] = useState('');
    const [reserving, setReserving] = useState<Restaurant | null>(null);

    const query = (uiState.searchQuery || '').trim();

    const cities = useMemo(() => {
        const unique = new Set(restaurants.map((r) => r.address?.city).filter((name): name is string => !!name));
        return Array.from(unique).sort((a, b) => a.localeCompare(b, 'fa'));
    }, [restaurants]);

    const withDistance = useMemo(
        () => restaurants.map((restaurant) => ({
            restaurant,
            km: origin ? distanceKm(origin, restaurant.location || {}) : null,
        })),
        [restaurants, origin]
    );

    const visible = useMemo(() => {
        const matched = withDistance.filter(({ restaurant }) => {
            const haystack = `${restaurant.name} ${restaurant.description || ''} ${restaurant.address?.city || ''} ${restaurant.address?.street || ''}`;
            const inQuery = !query || haystack.includes(query);
            return inQuery && (!city || restaurant.address?.city === city);
        });
        if (sort === 'nearby' && origin) {
            return matched.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
        }
        return matched.sort((a, b) => a.restaurant.name.localeCompare(b.restaurant.name, 'fa'));
    }, [withDistance, query, city, sort, origin]);

    const nearbyCount = useMemo(
        () => withDistance.filter(({ km }) => km !== null && km <= 5).length,
        [withDistance]
    );

    const locate = () => {
        if (!navigator.geolocation) {
            setLocateError('مرورگر شما از تعیین موقعیت پشتیبانی نمی‌کند');
            return;
        }
        setLocating(true);
        setLocateError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
                setSort('nearby');
                setLocating(false);
            },
            () => {
                setLocateError('موقعیت شما در دسترس نیست؛ دسترسی مرورگر را بررسی کنید');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">خطا در دریافت لیست رستوران‌ها</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-6">
                {/* ابزار جستجو و فیلتر */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="جستجوی رستوران، غذا یا محله"
                            value={uiState.searchQuery}
                            onChange={(e) => updateUiState({ searchQuery: e.target.value })}
                            className="w-full h-10 pr-9 pl-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    </div>

                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">همه شهرها</option>
                        {cities.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>

                    <button
                        onClick={locate}
                        disabled={locating}
                        className={`h-10 px-4 text-sm font-bold rounded-lg flex items-center gap-2 transition ${
                            origin
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        } disabled:opacity-60`}
                    >
                        {locating ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
                        {origin ? `${toPersianNumber(nearbyCount)} رستوران نزدیک` : 'نزدیک من'}
                    </button>

                    {origin && (
                        <button
                            onClick={() => setSort(sort === 'nearby' ? 'name' : 'nearby')}
                            className="h-10 px-4 text-sm font-bold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                        >
                            {sort === 'nearby' ? 'مرتب‌سازی: نزدیک‌ترین' : 'مرتب‌سازی: نام'}
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-500 mb-4">
                    {toPersianNumber(visible.length)} رستوران
                    {origin && sort === 'nearby' && ' · مرتب‌شده بر اساس فاصله از شما'}
                </p>

                {locateError && <p className="text-xs text-red-500 mb-4">{locateError}</p>}

                {visible.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <FaTable className="text-3xl mb-3 text-gray-300" />
                        <p className="text-sm">رستورانی با این جستجو پیدا نشد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visible.map(({ restaurant, km }) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                to={`/restaurants/menu/${restaurant._id}/0`}
                                distanceLabel={km !== null ? formatDistance(km) : undefined}
                                onReserve={setReserving}
                            />
                        ))}
                    </div>
                )}
            </div>

            {reserving && (
                <ReservationModal restaurant={reserving} onClose={() => setReserving(null)} />
            )}
        </div>
    );
};

export default Restaurants;
