import { useEffect, useRef, useState } from 'react';
import customFetch from '../../utils/customFetch';

type MapRestaurant = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: string;
  timeLabels: string[];
};

type Props = { restaurants: MapRestaurant[]; origin: { lat: number; lng: number } };

const SDK_CSS = 'https://static.neshan.org/sdk/leaflet/v1.9.4/neshan-sdk/v1.0.8/index.css';
const SDK_JS = 'https://static.neshan.org/sdk/leaflet/v1.9.4/neshan-sdk/v1.0.8/index.js';
let sdkPromise: Promise<void> | null = null;

const loadNeshanSdk = () => {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${SDK_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = SDK_CSS;
      document.head.appendChild(link);
    }
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${SDK_JS}"]`);
    if (existingScript?.dataset.loaded === 'true' && (window as any).L?.Map) {
      resolve();
      return;
    }
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Neshan map SDK failed to load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_JS;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      if ((window as any).L?.Map) resolve();
      else reject(new Error('Neshan SDK loaded without Leaflet map support'));
    };
    script.onerror = () => reject(new Error('Neshan map SDK failed to load'));
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
};

const NeshanNearbyMap = ({ restaurants, origin }: Props) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let map: any;
    const initialize = async () => {
      try {
        const { data } = await customFetch.get('/customer/maps/config');
        await loadNeshanSdk();
        if (cancelled || !mapElement.current) return;
        const L = (window as any).L;
        map = new L.Map('neshan-nearby-map', {
          key: data.mapKey,
          maptype: 'dreamy',
          center: [origin.lat, origin.lng],
          zoom: 12,
        });

        const points = [[origin.lat, origin.lng]];
        restaurants.forEach((restaurant, index) => {
          const point: [number, number] = [restaurant.lat, restaurant.lng];
          points.push(point);
          const icon = L.divIcon({
            className: 'zoodmiz-neshan-marker-wrap',
            html: `<span class="zoodmiz-neshan-marker"><span>${index + 1}</span></span>`,
            iconSize: [34, 42],
            iconAnchor: [17, 38],
          });
          const marker = L.marker(point, { icon }).addTo(map);
          const popup = document.createElement('div');
          popup.dir = 'rtl';
          popup.className = 'zoodmiz-map-popup';
          const title = document.createElement('strong');
          title.textContent = `${index + 1}. ${restaurant.name}`;
          popup.appendChild(title);
          const details = document.createElement('div');
          details.textContent = [restaurant.distance, ...restaurant.timeLabels].join(' · ');
          popup.appendChild(details);
          marker.bindPopup(popup);
        });

        const originIcon = L.divIcon({
          className: 'zoodmiz-neshan-origin-wrap',
          html: '<span class="zoodmiz-neshan-origin">شما</span>',
          iconSize: [42, 32],
          iconAnchor: [21, 16],
        });
        L.marker([origin.lat, origin.lng], { icon: originIcon }).addTo(map);
        if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 });
        window.setTimeout(() => map?.invalidateSize(), 80);
        setStatus('ready');
      } catch (error) {
        console.error('Unable to initialize Neshan nearby map', error);
        if (!cancelled) setStatus('error');
      }
    };
    initialize();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [restaurants, origin]);

  return <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-card dark:border-gray-700">
    {status === 'loading' && <div className="grid h-64 place-items-center text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری نقشه نشان…</div>}
    {status === 'error' && <div className="grid h-64 place-items-center px-5 text-center text-sm text-rose-600 dark:text-rose-300">نقشه بارگذاری نشد. کلید نقشه‌ی وب نشان و دسترسی دامنه را بررسی کنید.</div>}
    <div id="neshan-nearby-map" ref={mapElement} className={status === 'error' ? 'hidden' : 'h-[360px] w-full sm:h-[440px]'} />
    {status === 'ready' && <p className="border-t border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">شماره‌ی نشانگرها با ترتیب رستوران‌های فهرست‌شده یکی است.</p>}
  </div>;
};

export default NeshanNearbyMap;
