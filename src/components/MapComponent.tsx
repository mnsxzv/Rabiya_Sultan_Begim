import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HISTORICAL_POINTS, HistoricalPoint } from '../data/historicalData';
import { Compass, Layers, Maximize2, Navigation, ZoomIn, ZoomOut, MapPin, Sparkles } from 'lucide-react';

interface MapComponentProps {
  selectedPoint: HistoricalPoint | null;
  onSelectPoint: (point: HistoricalPoint) => void;
  onOpenPanel: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  selectedPoint,
  onSelectPoint,
  onOpenPanel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'osm' | 'voyager' | 'satellite'>('voyager');
  const [showDiplomaticPath, setShowDiplomaticPath] = useState(true);

  // Tile layer configurations
  const tileLayers = {
    voyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      name: 'Тарихи карта (CARTO)',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      name: 'Стандартты карта',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &copy; Earthstar Geographics',
      name: 'Спутниктік түсірілім',
    },
  };

  const tileLayerInstanceRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center at Turkestan (Rabiya Sultan Begim mausoleum)
    const initialLat = 43.2974;
    const initialLng = 68.2709;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
    });

    const baseLayer = L.tileLayer(tileLayers.voyager.url, {
      attribution: tileLayers.voyager.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerInstanceRef.current = baseLayer;
    mapInstanceRef.current = map;

    // Create markers for each historical point
    HISTORICAL_POINTS.forEach((pt) => {
      const isPrimary = pt.id === 'rabiya-mausoleum';

      const customIcon = L.divIcon({
        className: 'custom-historical-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="${
              isPrimary
                ? 'w-11 h-11 bg-gradient-to-tr from-amber-600 to-teal-500 ring-4 ring-amber-300/80 shadow-2xl animate-pulse'
                : 'w-8 h-8 bg-stone-900/90 border-2 border-amber-400 text-amber-300 shadow-md'
            } rounded-full flex items-center justify-center text-white font-bold transition-transform transform group-hover:scale-125 duration-200">
              ${
                isPrimary
                  ? '<span class="text-xl drop-shadow-md">👑</span>'
                  : pt.category === 'capital'
                  ? '<span class="text-xs">⚔️</span>'
                  : pt.category === 'origin'
                  ? '<span class="text-xs">🏛️</span>'
                  : '<span class="text-xs">📍</span>'
              }
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-950/90 text-stone-100 text-[11px] font-semibold px-2 py-0.5 rounded shadow border border-amber-500/40 pointer-events-none group-hover:bg-amber-950">
              ${pt.name}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectPoint(pt);
        onOpenPanel();
        map.flyTo([pt.lat, pt.lng], isPrimary ? 16 : 14, {
          duration: 1.2,
        });
      });

      markersRef.current[pt.id] = marker;
    });

    // Create Diplomatic Corridor Polyline (Samarkand -> Otyrar -> Turkestan -> Sauran -> Syghnaq)
    const pathCoordinates: [number, number][] = [
      [39.6542, 66.9597], // Samarkand
      [42.8517, 68.3033], // Otyrar
      [43.2974, 68.2709], // Turkestan
      [43.5161, 67.9255], // Sauran
      [44.1583, 67.3167], // Syghnaq
    ];

    const polyline = L.polyline(pathCoordinates, {
      color: '#d97706',
      weight: 3.5,
      opacity: 0.8,
      dashArray: '8, 8',
      className: 'diplomatic-corridor-line',
    }).addTo(map);

    polylineRef.current = polyline;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerInstanceRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerInstanceRef.current);
    const newLayer = L.tileLayer(tileLayers[activeTileLayer].url, {
      attribution: tileLayers[activeTileLayer].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerInstanceRef.current = newLayer;
  }, [activeTileLayer]);

  // Toggle Diplomatic Path
  useEffect(() => {
    if (!mapInstanceRef.current || !polylineRef.current) return;
    if (showDiplomaticPath) {
      if (!mapInstanceRef.current.hasLayer(polylineRef.current)) {
        polylineRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(polylineRef.current)) {
        mapInstanceRef.current.removeLayer(polylineRef.current);
      }
    }
  }, [showDiplomaticPath]);

  // Fly to selected point when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPoint) return;
    mapInstanceRef.current.flyTo(
      [selectedPoint.lat, selectedPoint.lng],
      selectedPoint.id === 'rabiya-mausoleum' ? 16 : 14,
      { duration: 1.2 }
    );
  }, [selectedPoint]);

  // Quick navigation handlers
  const focusTurkestan = () => {
    if (!mapInstanceRef.current) return;
    const rabiyaPt = HISTORICAL_POINTS[0];
    onSelectPoint(rabiyaPt);
    mapInstanceRef.current.flyTo([43.2974, 68.2709], 16, { duration: 1.2 });
  };

  const focusRegionalOverview = () => {
    if (!mapInstanceRef.current) return;
    // Fit bounds of all points
    const bounds = L.latLngBounds(HISTORICAL_POINTS.map((p) => [p.lat, p.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], duration: 1.4 });
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Navigation & Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {/* Layer Switcher */}
        <div className="bg-stone-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-1.5 shadow-xl flex flex-col gap-1">
          <button
            onClick={() => setActiveTileLayer('voyager')}
            title="Тарихи стиль (CARTO)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTileLayer === 'voyager'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Тарихи</span>
          </button>
          <button
            onClick={() => setActiveTileLayer('satellite')}
            title="Спутник"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTileLayer === 'satellite'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Спутник</span>
          </button>
          <button
            onClick={() => setActiveTileLayer('osm')}
            title="Көшелер"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTileLayer === 'osm'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OSM</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-stone-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-1 shadow-xl flex flex-col">
          <button
            onClick={zoomIn}
            className="p-2 text-stone-200 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
            title="Жақындату"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 text-stone-200 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
            title="Алыстату"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top-Left Quick Presets */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-2 items-center">
        <button
          onClick={focusTurkestan}
          className="bg-stone-900/90 hover:bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 transition active:scale-95"
        >
          <span className="text-sm">👑</span>
          <span>Түркістан кесенесі</span>
        </button>

        <button
          onClick={focusRegionalOverview}
          className="bg-stone-900/90 hover:bg-stone-800 backdrop-blur-md border border-stone-700 text-stone-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 transition active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">Барлық байланыстар (Дешті Қыпшақ)</span>
          <span className="xs:hidden">Жалпы карта</span>
        </button>

        <button
          onClick={() => setShowDiplomaticPath(!showDiplomaticPath)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md border transition flex items-center gap-1.5 ${
            showDiplomaticPath
              ? 'bg-amber-600/30 border-amber-500 text-amber-200'
              : 'bg-stone-900/80 border-stone-700 text-stone-400'
          }`}
          title="Дипломатиялық сапар желісін қосу/өшіру"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Дипломатиялық дәліз</span>
        </button>
      </div>

      {/* Bottom Hint Banner (when panel is minimized) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[390] pointer-events-none">
        <div className="bg-stone-950/80 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>Маркерлерді басып, тарихи мағлұматтарды ашыңыз</span>
        </div>
      </div>
    </div>
  );
};
