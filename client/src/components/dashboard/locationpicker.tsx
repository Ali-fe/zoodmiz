import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

// leaflet's default icon is not webpack-friendly, so we need to fix it
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


interface LocationPickerProps {
    lat: number;
    lng: number;
    onLocationChange: (lat: number, lng: number) => void;
}

const LocationPicker = ({ lat, lng, onLocationChange }: LocationPickerProps) => {
    const position: LatLngExpression = [lat, lng];

    const DraggableMarker = () => {
        const [markerPosition, setMarkerPosition] = useState(position);
        const map = useMap();

        useEffect(() => {
             // fly to new position when props change
             if(lat !== markerPosition[0] || lng !== markerPosition[1]) {
                const newPos: LatLngExpression = [lat, lng];
                setMarkerPosition(newPos);
                map.flyTo(newPos, map.getZoom());
             }
        }, [lat, lng, map]);


        useMapEvents({
            click(e) {
                const newPos = e.latlng;
                setMarkerPosition([newPos.lat, newPos.lng]);
                onLocationChange(newPos.lat, newPos.lng);
            },
        });

        return (
            <Marker
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const newPos = e.target.getLatLng();
                        setMarkerPosition([newPos.lat, newPos.lng]);
                        onLocationChange(newPos.lat, newPos.lng);
                    },
                }}
                position={markerPosition}
            />
        );
    };

    return (
        <MapContainer center={position} zoom={13} style={{ height: '250px', width: '100%', borderRadius: '8px', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker />
        </MapContainer>
    );
};

export default LocationPicker; 