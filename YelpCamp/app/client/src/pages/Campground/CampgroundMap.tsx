import React, { useRef, useMemo, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

import { Campground } from '../../types';

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
        <div style="padding:6px;">
            <h6>${campground.title}</h6>
            <span style="display:block;">${campground.location}</span>
            <small>(${coordinates.longitude.toFixed(2)}, ${coordinates.latitude.toFixed(2)})</small>
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
                style={{ height: '450px' }}
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
