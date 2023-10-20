import React, { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';

import { Campground } from '../../types';

interface CampgroundMapProps {
    campground: Campground;
}

const CampgroundMap: React.FunctionComponent<CampgroundMapProps> = ({ campground }) => {
    const [showPopup, setShowPopup] = useState(true);

    const coordinates = {
        longitude: campground.geometry.coordinates[0],
        latitude: campground.geometry.coordinates[1],
    };

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
                <Marker {...coordinates} anchor="top" onClick={() => setShowPopup(!showPopup)} />
                {showPopup && (
                    <Popup
                        longitude={coordinates.longitude}
                        latitude={coordinates.latitude}
                        anchor="bottom"
                        closeOnClick={false}
                        onClose={() => setShowPopup(false)}
                        closeButton={false}
                        offset={10}
                    >
                        <div style={{ padding: '6px' }}>
                            <h6>{campground.title}</h6>
                            <span style={{ display: 'block' }}>{campground.location}</span>
                            <small>
                                ({coordinates.longitude.toFixed(2)},{' '}
                                {coordinates.latitude.toFixed(2)})
                            </small>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
};

export default CampgroundMap;
