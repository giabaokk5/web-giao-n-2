// src/components/customer/DaNangLiveMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Store, MapPin, Bike, Navigation, Layers } from 'lucide-react';

interface DaNangLiveMapProps {
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantName: string;
  customerLat?: number;
  customerLng?: number;
  customerAddressTitle: string;
  driverName?: string;
  driverLicensePlate?: string;
  progressPercent: number; // 0 to 100
  isDelivering: boolean;
}

export const DaNangLiveMap: React.FC<DaNangLiveMapProps> = ({
  restaurantLat = 16.062,
  restaurantLng = 108.2045,
  restaurantName,
  customerLat = 16.0682,
  customerLng = 108.2145,
  customerAddressTitle,
  driverName = 'Nguyễn Văn Be',
  driverLicensePlate = '43-D1 888.68',
  progressPercent,
  isDelivering,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [mapType, setMapType] = React.useState<'google_roadmap' | 'google_satellite' | 'osm'>('google_roadmap');

  // Compute interpolated driver coordinates along Da Nang city roads
  const progressRatio = Math.min(100, Math.max(0, progressPercent)) / 100;
  const currentDriverLat = restaurantLat + (customerLat - restaurantLat) * progressRatio;
  const currentDriverLng = restaurantLng + (customerLng - restaurantLng) * progressRatio;

  const getTileUrl = (type: 'google_roadmap' | 'google_satellite' | 'osm') => {
    switch (type) {
      case 'google_roadmap':
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'google_satellite':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'osm':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map instance centered at Da Nang center (Cau Rong / Song Han)
    const map = L.map(mapContainerRef.current, {
      center: [16.065, 108.21],
      zoom: 14,
      zoomControl: false,
    });

    // Add Google Maps roadmap layer (Real Google Maps Tiles)
    const tileLayer = L.tileLayer(getTileUrl(mapType), {
      maxZoom: 20,
      attribution: '&copy; Google Maps | beFood Đà Nẵng GPS Live',
    }).addTo(map);
    currentTileLayerRef.current = tileLayer;

    // Add zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Custom Marker HTML Elements
    const restaurantIcon = L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div style="transform: translate(-50%, -100%);">
          <div style="background: #00204A; color: white; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 10px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
            <span>🏪</span>
            <span>${restaurantName}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #00204A; margin: 0 auto;"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const customerIcon = L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div style="transform: translate(-50%, -100%);">
          <div style="background: #E11D48; color: white; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 10px; white-space: nowrap; box-shadow: 0 4px 10px rgba(225,29,72,0.4); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span>${customerAddressTitle}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #E11D48; margin: 0 auto;"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const driverIcon = L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div style="transform: translate(-50%, -50%);">
          <div style="position: relative;">
            <div style="width: 44px; height: 44px; background: #FFC700; border: 3px solid #00204A; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(0,0,0,0.3); font-size: 20px;">
              🛵
            </div>
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #00204A; color: #FFC700; font-weight: 900; font-size: 9px; padding: 2px 6px; border-radius: 8px; white-space: nowrap; border: 1px solid #FFC700;">
              ${driverName} (${driverLicensePlate})
            </div>
            <div style="position: absolute; inset: -6px; border: 2px solid #FFC700; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });

    // Add Restaurant Marker
    L.marker([restaurantLat, restaurantLng], { icon: restaurantIcon }).addTo(map);

    // Add Customer Marker
    L.marker([customerLat, customerLng], { icon: customerIcon }).addTo(map);

    // Add Moving Driver Marker
    const driverMarker = L.marker([currentDriverLat, currentDriverLng], { icon: driverIcon }).addTo(map);
    driverMarkerRef.current = driverMarker;

    // Add Route Polyline
    const routeCoords: [number, number][] = [
      [restaurantLat, restaurantLng],
      [currentDriverLat, currentDriverLng],
      [customerLat, customerLng],
    ];

    const polyline = L.polyline(routeCoords, {
      color: '#FFC700',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(map);
    polylineRef.current = polyline;

    // Fit bounds to show all points
    const bounds = L.latLngBounds([
      [restaurantLat, restaurantLng],
      [customerLat, customerLng],
    ]);
    map.fitBounds(bounds, { padding: [60, 60] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [restaurantLat, restaurantLng, customerLat, customerLng]);

  // Update Driver Marker Position when progress updates
  useEffect(() => {
    if (driverMarkerRef.current && mapInstanceRef.current) {
      const newPos = L.latLng(currentDriverLat, currentDriverLng);
      driverMarkerRef.current.setLatLng(newPos);

      // Update polyline
      if (polylineRef.current) {
        polylineRef.current.setLatLngs([
          [restaurantLat, restaurantLng],
          [currentDriverLat, currentDriverLng],
          [customerLat, customerLng],
        ]);
      }
    }
  }, [currentDriverLat, currentDriverLng, restaurantLat, restaurantLng, customerLat, customerLng]);

  // Switch Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }
    const newTile = L.tileLayer(getTileUrl(mapType), {
      maxZoom: 20,
      attribution: mapType.startsWith('google')
        ? '&copy; Google Maps | beFood Đà Nẵng Live GPS'
        : '&copy; OpenStreetMap contributors | beFood Đà Nẵng',
    }).addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newTile;
  }, [mapType]);

  const handleCenterMap = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([
        [restaurantLat, restaurantLng],
        [currentDriverLat, currentDriverLng],
        [customerLat, customerLng],
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      {/* Real Google Maps / OpenStreetMap Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating Control Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 text-xs font-bold text-slate-800">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[#00204A] font-extrabold flex items-center gap-1">
          <span>Google Maps</span>
        </span>
        <span className="text-slate-400 font-normal">|</span>
        <span className="text-amber-600 font-extrabold">{progressPercent}% lộ trình</span>
      </div>

      {/* Map Layer Switcher: Google Roadmap vs Google Satellite */}
      <div className="absolute top-3 right-12 z-10 flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-slate-200 text-[10px] font-bold">
        <button
          onClick={() => setMapType('google_roadmap')}
          className={`px-2 py-1 rounded-xl transition-all cursor-pointer ${
            mapType === 'google_roadmap'
              ? 'bg-[#00204A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Bản đồ đường phố Google Maps"
        >
          Google Maps
        </button>
        <button
          onClick={() => setMapType('google_satellite')}
          className={`px-2 py-1 rounded-xl transition-all cursor-pointer ${
            mapType === 'google_satellite'
              ? 'bg-[#00204A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Bản đồ vệ tinh Google Maps"
        >
          Vệ Tinh
        </button>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-2">
        <button
          onClick={handleCenterMap}
          className="bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-800 font-bold px-3 py-1.5 rounded-2xl shadow-md border border-slate-200 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          title="Căn giữa toàn bộ lộ trình"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-500" />
          <span>Lộ trình toàn cảnh</span>
        </button>
      </div>

      {/* Floating Status Card */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#00204A]/95 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-white/20 text-xs flex items-center gap-2 max-w-[280px]">
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
          🛵
        </div>
        <div className="truncate">
          <div className="font-extrabold text-[11px] text-amber-300">
            {isDelivering ? 'Tài xế đang giao tới bạn' : 'Tài xế đang nhận món tại quán'}
          </div>
          <div className="text-[10px] text-slate-300 truncate">
            {driverName} • {driverLicensePlate}
          </div>
        </div>
      </div>
    </div>
  );
};

