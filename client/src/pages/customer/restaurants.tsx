import { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaSpinner, FaTable, FaTimes } from 'react-icons/fa';
import { useCustomerContext } from '../../pages/customer/customerlayout';
import { useRestaurants, type Restaurant } from '../../hooks/useCustomer';
import RestaurantCard from '../../components/customer/restaurantcard';
import ReservationModal from '../../components/customer/ReservationModal';
import { EmptyState } from '../../components/dashboard/ui';
import { distanceKm, formatDistance } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';

type SortMode = 'name' | 'nearby';

const SkeletonCard = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-gray-700 dark:bg-gray-800">
        <div className="skeleton h-40 w-full bg-gray-100 dark:bg-gray-700" />
        <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-700" />
            <div className="skeleton h-3 w-full rounded bg-gray-100 dark:bg-gray-700" />
            <div className="skeleton h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-700" />
            <div className="skeleton mt-3 h-9 w-full rounded-xl bg-gray-100 dark:bg-gray-700" />
        </div>
    </div>
);

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

    const chip = (active: boolean) =>
        `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
            active
                ? 'bg-white text-primary-800 shadow-card'
                : 'bg-white/25 text-white hover:bg-white/40'
        }`;

    return (
        <div className="min-h-screen bg-cream transition-colors duration-200 dark:bg-gray-900">
            {/* نوار جستجو و فیلتر */}
            <section className="relative overflow-hidden bg-gradient-to-bl from-primary-500 via-primary-600 to-accent px-4 pb-16 pt-10 text-white">
                <span className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <span className="pointer-events-none absolute bottom-[-70px] left-1/3 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

                <div className="container relative mx-auto">
                    <h1 className="text-2xl font-bold leading-snug font-vazirmatn-title sm:text-3xl">
                        میز امشب‌ات را پیدا کن
                    </h1>
                    <p className="mt-1.5 text-sm text-white/85">
                        {isLoading
                            ? 'در حال خواندن فهرست رستوران‌ها…'
                            : `${toPersianNumber(restaurants.length)} رستوران آماده پذیرایی هستند`}
                        {origin && ` · ${toPersianNumber(nearbyCount)} رستوران تا ۵ کیلومتر تو`}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[240px] flex-1">
                            <input
                                type="text"
                                placeholder="جستجوی رستوران، غذا یا محله"
                                value={uiState.searchQuery}
                                onChange={(e) => updateUiState({ searchQuery: e.target.value })}
                                aria-label="جستجوی رستوران"
                                className="h-11 w-full rounded-xl border border-white/30 bg-white/95 px-9 text-sm text-gray-800 shadow-card placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/70"
                            />
                            <FaSearch className="absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => updateUiState({ searchQuery: '' })}
                                    aria-label="پاک کردن جستجو"
                                    className="absolute start-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <FaTimes className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={locate}
                            disabled={locating}
                            className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-70 ${
                                origin
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                        >
                            {locating ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaMapMarkerAlt className="h-3.5 w-3.5" />}
                            {origin ? `${toPersianNumber(nearbyCount)} رستوران نزدیک` : 'نزدیک من'}
                        </button>

                        {origin && (
                            <button
                                type="button"
                                onClick={() => setSort(sort === 'nearby' ? 'name' : 'nearby')}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/20 px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-white/30 active:scale-95"
                            >
                                مرتب‌سازی: {sort === 'nearby' ? 'نزدیک‌ترین' : 'نام'}
                            </button>
                        )}
                    </div>

                    {cities.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                            <button type="button" onClick={() => setCity('')} className={chip(!city)}>
                                همه شهرها
                            </button>
                            {cities.map((name) => (
                                <button key={name} type="button" onClick={() => setCity(name)} className={chip(city === name)}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}

                    {locateError && (
                        <p className="mt-3 inline-block rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-rose-600">
                            {locateError}
                        </p>
                    )}
                </div>
            </section>

            {/* کارت‌ها */}
            <div className="container mx-auto -mt-10 px-4 pb-12">
                <p className="mb-3 text-xs font-bold text-white/90">
                    {toPersianNumber(visible.length)} رستوران
                    {origin && sort === 'nearby' && ' · مرتب‌شده بر اساس فاصله از شما'}
                </p>

                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-10 text-center text-sm font-bold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                        خطا در دریافت لیست رستوران‌ها
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <div className="-mt-14">
                        <EmptyState
                            icon={<FaTable />}
                            title="رستورانی با این جستجو پیدا نشد"
                            hint="نام دیگری را امتحان کنید، فیلتر شهر را بردارید یا موقعیت خود را تغییر دهید."
                            action={
                                (query || city) ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateUiState({ searchQuery: '' });
                                            setCity('');
                                        }}
                                        className="rounded-xl border border-primary-300 px-4 py-2 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-500/40 dark:text-primary-300 dark:hover:bg-primary-500/10"
                                    >
                                        پاک کردن فیلترها
                                    </button>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
