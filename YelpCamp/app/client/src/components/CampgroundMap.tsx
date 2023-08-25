import React, { useRef, useMemo, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

import { Campground } from '../types';

interface CampgroundMapProps {
    campground: Campground;
}

const CampgroundMap: React.FunctionComponent<CampgroundMapProps> = ({ campground }) => {
    const markerRef = useRef<mapboxgl.Marker>();

    const coordinates = {
        longitude: campground.geometry.coordinates[0],
        latitude: campground.geometry.coordinates[1],
    };

    const popup = useMemo(() => {
        return new mapboxgl.Popup().setOffset(10).setHTML(`
        <div>
            <h6>${campground.title}</h6>
            <span>${coordinates.longitude}, ${coordinates.latitude}</span>
        </div>`);
    }, []);

    const togglePopup = useCallback(() => {
        markerRef.current?.togglePopup();
    }, []);

    return (
        <div>
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    ...coordinates,
                    zoom: 8,
                }}
                style={{ height: 500 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                attributionControl={false}
            >
                <NavigationControl />
                <Marker
                    {...coordinates}
                    anchor="top"
                    onClick={togglePopup}
                    popup={popup}
                    ref={markerRef}
                ></Marker>
            </Map>

            
        </div>
    );
};

export default CampgroundMap;
