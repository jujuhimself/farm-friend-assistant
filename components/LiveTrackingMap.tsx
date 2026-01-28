
import React, { useEffect, useRef, useState } from 'react';

// Declare google as a global variable to resolve TypeScript errors
declare const google: any;

interface LiveTrackingMapProps {
  orderId: string;
  destination: string;
  status: string;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ orderId, destination, status }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const TERMINAL_MAP_STYLE = [
    { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#141414" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadGoogleMaps = () => {
      // If already loaded, resolve immediately
      if ((window as any).google && (window as any).google.maps) {
        return Promise.resolve();
      }

      // Check for existing script to avoid duplicates
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        return new Promise((resolve, reject) => {
          existingScript.addEventListener('load', resolve);
          existingScript.addEventListener('error', reject);
        });
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=geometry&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('UPLINK_TIMEOUT: MAP_PROTOCOL_FAILED'));
        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      if (!mapRef.current || !(window as any).google) return;

      const origin = { lat: -6.7924, lng: 39.2026 }; 
      const destCoords = destination.includes('Dubai') ? { lat: 25.2048, lng: 55.2708 } : { lat: 53.5511, lng: 9.9937 };

      const map = new google.maps.Map(mapRef.current, {
        center: origin,
        zoom: 3,
        styles: TERMINAL_MAP_STYLE,
        disableDefaultUI: true,
        backgroundColor: '#0a0a0a'
      });

      // Add Origin Marker
      new google.maps.Marker({
        position: origin,
        map,
        title: "ORIGIN: DAR ES SALAAM",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#00ff88",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });

      // Add Destination Marker
      new google.maps.Marker({
        position: destCoords,
        map,
        title: `DESTINATION: ${destination}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#00aaff",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });

      // Draw Path
      const path = new google.maps.Polyline({
        path: [origin, destCoords],
        geodesic: true,
        strokeColor: "#00ff88",
        strokeOpacity: 0.4,
        strokeWeight: 2,
        icons: [{
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2, strokeColor: '#00ff88' },
          offset: '50%'
        }]
      });

      path.setMap(map);

      // Track active shipment
      if (status === 'SHIPPED') {
        const shipPos = { 
          lat: (origin.lat + destCoords.lat) / 1.5, 
          lng: (origin.lng + destCoords.lng) / 1.5 
        };
        
        new google.maps.Marker({
          position: shipPos,
          map,
          icon: {
            path: "M20,13.5L14,20L10,20L4,13.5L4,11L20,11L20,13.5Z",
            fillColor: "#00ff88",
            fillOpacity: 1,
            scale: 1,
            anchor: new google.maps.Point(12, 12),
            strokeWeight: 1,
            strokeColor: "#ffffff"
          }
        });
      }
      
      setIsLoading(false);
    };

    loadGoogleMaps()
      .then(() => {
        if (isMounted) initMap();
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [destination, status]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-background border border-border rounded-2xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-background flex flex-col items-center justify-center gap-4">
           <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] animate-pulse">Connecting_to_Sat_Link...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 bg-background flex flex-col items-center justify-center p-8 text-center">
           <span className="text-4xl mb-4">⚠️</span>
           <p className="text-xs font-mono text-danger uppercase tracking-widest mb-2">{error}</p>
           <p className="text-[9px] font-mono text-textMuted uppercase max-w-xs leading-relaxed">
             Map Protocol Interrupted. Ensure Maps JavaScript API is enabled in your Google Cloud Console.
           </p>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full absolute inset-0" />
      
      {!isLoading && !error && (
        <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md border border-primary/30 p-3 rounded-lg font-mono text-[9px] uppercase tracking-widest text-primary">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            ENCRYPTED_TELEMETRY_LINK: {orderId}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
