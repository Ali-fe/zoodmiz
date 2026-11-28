import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaChevronDown, FaMapMarkerAlt, FaRoute, FaSearch, FaSpinner, FaTable, FaTimes } from 'react-icons/fa';
import { useCustomerContext } from '../../pages/customer/customerlayout';
import { useRestaurants, type Restaurant } from '../../hooks/useCustomer';
import RestaurantCard from '../../components/customer/restaurantcard';
import ReservationModal from '../../components/customer/ReservationModal';
import { EmptyState } from '../../components/dashboard/ui';
import { distanceKm, formatDistance, formatDrivingTime } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';
import customFetch from '../../utils/customFetch';

type SortMode = 'name' | 'distance' | 'time' | 'rating';
type RouteProvider = 'neshan' | 'google' | 'other';

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
    const [routeProvider, setRouteProvider] = useState<RouteProvider>('neshan');
    const [routeMenuOpen, setRouteMenuOpen] = useState(false);
    const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);
    const [locateError, setLocateError] = useState('');
    const [reserving, setReserving] = useState<Restaurant | null>(null);
    const [drivingTimes, setDrivingTimes] = useState<Record<string, { google?: number; neshan?: number }>>({});
    const [trafficLoading, setTrafficLoading] = useState(false);

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
        if (sort === 'distance' && origin) return matched.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
        if (sort === 'rating') return matched.sort((a, b) => (b.restaurant.ratingAverage || 0) - (a.restaurant.ratingAverage || 0));
        if (sort === 'time' && origin) return matched.sort((a, b) =>
            (drivingTimes[a.restaurant._id]?.[routeProvider === 'other' ? 'neshan' : routeProvider] ?? Infinity) -
            (drivingTimes[b.restaurant._id]?.[routeProvider === 'other' ? 'neshan' : routeProvider] ?? Infinity));
        return matched.sort((a, b) => a.restaurant.name.localeCompare(b.restaurant.name, 'fa'));
    }, [withDistance, query, city, sort, origin, drivingTimes, routeProvider]);

    const nearbyCount = useMemo(
        () => withDistance.filter(({ km }) => km !== null && km <= 5).length,
        [withDistance]
    );

    const nearestTen = useMemo(() => withDistance.filter(({ restaurant }) => {
        const haystack = `${restaurant.name} ${restaurant.description || ''} ${restaurant.address?.city || ''} ${restaurant.address?.street || ''}`;
        const { lat, lng } = restaurant.location || {};
        return (!query || haystack.includes(query)) && (!city || restaurant.address?.city === city) &&
            Number.isFinite(lat) && Number.isFinite(lng);
    }).sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity)).slice(0, 10), [withDistance, query, city]);
    const nearestTenIds = useMemo(() => new Set(nearestTen.map(({ restaurant }) => restaurant._id)), [nearestTen]);

    useEffect(() => {
        setDrivingTimes({});
        if (!origin || nearestTen.length === 0) return;
        let cancelled = false;
        setTrafficLoading(true);
        customFetch.post('/customer/routes/driving-estimates', {
            origin,
            destinations: nearestTen.map(({ restaurant }) => ({
                id: restaurant._id,
                lat: restaurant.location!.lat,
                lng: restaurant.location!.lng,
            })),
        }).then(({ data }) => {
            if (!cancelled) {
                setDrivingTimes(Object.fromEntries(data.estimates.map((item: {
                    id: string;
                    google?: { durationMinutes?: number | null } | null;
                    neshan?: { durationMinutes?: number | null } | null;
                }) => [item.id, {
                    ...(Number.isFinite(item.google?.durationMinutes) ? { google: item.google!.durationMinutes! } : {}),
                    ...(Number.isFinite(item.neshan?.durationMinutes) ? { neshan: item.neshan!.durationMinutes! } : {}),
                }])));
            }
        }).catch(() => {}).finally(() => { if (!cancelled) setTrafficLoading(false); });
        return () => { cancelled = true; };
    }, [origin, nearestTen]);

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
                setSort('distance');
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

    const sortOptions: { value: SortMode; label: string }[] = [
        { value: 'name', label: 'نام' },
        ...(origin ? [
            { value: 'distance' as const, label: 'نزدیک‌ترین' },
            { value: 'time' as const, label: 'زودتر می‌رسه' },
        ] : []),
        { value: 'rating', label: 'بالاترین امتیاز' },
    ];
    const routeProviderLabel = routeProvider === 'neshan' ? 'نشان' : routeProvider === 'google' ? 'گوگل‌مپ' : 'برنامه‌ی دیگر';

    return (
        <div className="min-h-screen bg-cream transition-colors duration-200 dark:bg-gray-900">
            {/* نوار جستجو و فیلتر */}
            <section className="relative z-20 overflow-visible bg-gradient-to-bl from-primary-500 via-primary-600 to-accent px-4 pb-10 pt-10 text-white sm:pb-16">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <span className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                    <span className="absolute bottom-[-70px] left-1/3 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
                </div>

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

                        <div className="relative">
                            <button type="button" aria-haspopup="menu" aria-expanded={routeMenuOpen} onClick={() => setRouteMenuOpen((open) => !open)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/25 bg-white/15 px-2.5 text-[11px] font-bold text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                <FaRoute className="h-3.5 w-3.5" />
                                <span>مسیریابی</span>
                                <span className="rounded-md bg-white/20 px-1.5 py-0.5">{routeProviderLabel}</span>
                                <FaChevronDown className={`h-2.5 w-2.5 transition-transform ${routeMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {routeMenuOpen && <div role="menu" aria-label="انتخاب برنامه مسیریابی" className="absolute end-0 top-full z-30 mt-2 min-w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 text-gray-800 shadow-lift dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                {([
                                    ['neshan', 'نشان'],
                                    ['google', 'گوگل‌مپ'],
                                    ['other', 'برنامه‌ی نقشه‌ی دیگر'],
                                ] as [RouteProvider, string][]).map(([provider, label]) => <button key={provider} type="button" role="menuitemradio" aria-checked={routeProvider === provider} onClick={() => { setRouteProvider(provider); setRouteMenuOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-xs font-bold transition hover:bg-primary-50 dark:hover:bg-primary-500/10">
                                    {label}{routeProvider === provider && <FaCheck className="h-3 w-3 text-primary-600 dark:text-primary-300" />}
                                </button>)}
                            </div>}
                        </div>
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
                    {trafficLoading && <p className="mt-2 text-xs text-white/80">در حال دریافت زمان مسیر و ترافیک زنده…</p>}
                </div>
            </section>

            {/* کارت‌ها */}
            <div className="container mx-auto mt-0 px-4 pb-12 sm:-mt-10">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-bold text-gray-500 sm:text-white/90">
                        {toPersianNumber(origin ? Math.min(20, visible.length) : visible.length)} رستوران
                        {origin && ' · زمان مسیر برای ۱۰ رستوران نزدیک‌تر'}
                    </p>
                    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" role="group" aria-label="مرتب‌سازی رستوران‌ها">
                        {sortOptions.map((option) => <button key={option.value} type="button" aria-pressed={sort === option.value} onClick={() => setSort(option.value)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${sort === option.value ? 'bg-primary text-white shadow-card' : 'border border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-primary-300'}`}>
                            {option.label}
                        </button>)}
                    </div>
                </div>

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
                        {visible.slice(0, origin ? 20 : visible.length).map(({ restaurant, km }) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                to={`/restaurants/menu/${restaurant._id}/0`}
                                distanceLabel={km !== null ? formatDistance(km) : undefined}
                                drivingTimeLabels={km !== null && nearestTenIds.has(restaurant._id) ? [
                                    ...(drivingTimes[restaurant._id]?.google !== undefined ? [`گوگل: ${toPersianNumber(drivingTimes[restaurant._id].google!)} دقیقه`] : []),
                                    ...(drivingTimes[restaurant._id]?.neshan !== undefined ? [`نشان: ${toPersianNumber(drivingTimes[restaurant._id].neshan!)} دقیقه`] : []),
                                    ...(!drivingTimes[restaurant._id]?.google && !drivingTimes[restaurant._id]?.neshan ? [formatDrivingTime(km)] : []),
                                ] : []}
                                showDirections={origin !== null}
                                routeProvider={routeProvider}
                                origin={origin}
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
