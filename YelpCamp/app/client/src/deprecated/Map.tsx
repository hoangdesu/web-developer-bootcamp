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

        // const map = new mapboxgl.Map({
        //     container: mapContainer.current,
        //     style: "mapbox://styles/mapbox/streets-v11",
        //     center: coordinates,
        //     zoom: zoom,
        //   });

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coordinates,
            zoom: zoom,
        });

        const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<img src="https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg" width="60px" />`,
                ),
            ) // add popups
            .addTo(map.current);

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // map.current.flyTo({center: [-122.4, 37.8]})

        // map.current = new mapboxgl.Marker()
        //     .setLngLat(coordinates)
        //     .setPopup(
        //         new mapboxgl.Popup({ offset: 25 }), // add popups
        //         //   .setHTML(
        //         //     `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        //         //   )
        //     )
        //     .addTo(map);

        // map.current.on('move', () => {
        //     console.log(map.current.getCenter().lng.toFixed(4));

        //     setLng(map.current.getCenter().lng.toFixed(4));
        //     setLat(map.current.getCenter().lat.toFixed(4));
        //     setZoom(map.current.getZoom().toFixed(2));
        // });

        // Clean up on unmount
        // return () => map.current.remove();
    });

    return <div ref={mapContainer} className="map-container" style={{ height: '300px' }} />;
};

export default Map;
