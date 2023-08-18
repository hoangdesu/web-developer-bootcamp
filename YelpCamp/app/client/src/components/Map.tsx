import React, { useState, useEffect, useRef } from 'react';

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapProps {
    viewState: {
        mapCoordinates: number[];
        zoom?: number;
    };
}

const Map: React.FC<MapProps> = ({ viewState }) => {
    const { mapCoordinates, zoom = 7 } = viewState;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [coordinates, setCoordinates] = useState(mapCoordinates);

    useEffect(() => {
        // if (!coordinates) return;
        if (!mapContainer.current) return; // ensure there is a current instance of mapContainer
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coordinates,
            zoom: zoom,
        });

        // map.current.on('move', () => {
        //     setLng(map.current.getCenter().lng.toFixed(4));
        //     setLat(map.current.getCenter().lat.toFixed(4));
        //     setZoom(map.current.getZoom().toFixed(2));
        // });
    });

    return <div ref={mapContainer} className="map-container" style={{ height: '300px' }} />;
};

export default Map;
