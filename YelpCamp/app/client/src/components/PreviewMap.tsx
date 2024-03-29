import mapboxgl from 'mapbox-gl';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';

interface PreviewMapProps {
    coordinates: number[];
    location: string;
}

const PreviewMap: React.FunctionComponent<PreviewMapProps> = ({ coordinates, location }) => {
    const markerRef = useRef<mapboxgl.Marker>();
    const mapRef = useRef<MapRef>();

    // flyTo animation when user clicks on a suggested location
    useEffect(() => {
        if (coordinates.length > 0) {
            mapRef.current?.flyTo({
                center: [coordinates[0], coordinates[1]],
                duration: 2000,
                zoom: 10.0,
            });
        } else {
            mapRef.current?.flyTo({
                center: [107, 16.0],
                duration: 3000,
                zoom: 3.0,
            });
        }
    }, [coordinates]);

    const popup = useMemo(() => {
        if (location && coordinates.length > 0) {
            return new mapboxgl.Popup().setOffset(10).setHTML(`
            <div style="padding: 6px;">
                <h6>${location || 'Location'}</h6>
                <small style="center">(${coordinates[0].toFixed(2)} ${coordinates[1].toFixed(
                2,
            )})</small>
            </div>`);
        }
    }, [location]);

    const togglePopup = useCallback(() => {
        markerRef.current?.togglePopup();
    }, []);

    return (
        <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
                // Default coordinate to Vietnam
                longitude: coordinates.length > 0 ? coordinates[0] : 107,
                latitude: coordinates.length > 0 ? coordinates[1] : 16.0,
                zoom: coordinates.length > 0 ? 10 : 3.0,
            }}
            style={{ height: '300px' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            attributionControl={false}
            ref={mapRef}
        >
            <NavigationControl />

            {location && coordinates.length > 0 && (
                <Marker
                    longitude={coordinates[0]}
                    latitude={coordinates[1]}
                    anchor="top"
                    onClick={togglePopup}
                    popup={popup}
                />
            )}
        </Map>
    );
};

export default memo(PreviewMap);
