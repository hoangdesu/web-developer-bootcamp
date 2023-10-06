import React, { useRef, useMemo, useCallback, useEffect, useState, memo } from 'react';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

interface PreviewMapProps {
    coordinates: number[];
    location: string;
}

const PreviewMap: React.FunctionComponent<PreviewMapProps> = ({ coordinates, location }) => {
    const markerRef = useRef<mapboxgl.Marker>();
    const mapRef = useRef<MapRef>();

    const [viewState, setViewState] = useState({
        // default coordinates to Vietnam
        longitude: coordinates.length > 0 ? coordinates[0] : 107,
        latitude: coordinates.length > 0 ? coordinates[1] : 16.0,
        zoom: coordinates.length > 0 ? 10 : 3.0,
    });

    // const [locationName, setLocationName] = useState(location || '');

    // useEffect(() => {
    //     if (previewGeometry) {
    //         setViewState({
    //             longitude: previewGeometry.coordinates[0],
    //             latitude: previewGeometry.coordinates[1], // default coordinate to Vietnam
    //             zoom: 9,
    //         });
    //     }
    // }, []);

    // const [viewState, setViewState] = useState({
    //     longitude: 107.7017555,
    //     latitude: 16.0, // default coordinate to Vietnam
    //     zoom: 4,
    // });

    // const [coordinates, setCoordinates] = useState({
    //     // longitude: campground.geometry.coordinates[0],
    //     // latitude: campground.geometry.coordinates[1],
    //     longitude: 105.89,
    //     latitude: 20,
    // });

    // useEffect(() => {
    //     mapRef.current?.flyTo({
    //         center: [coordinates.longitude, coordinates.latitude],
    //         duration: 2000,
    //     });
    // }, [coordinates]);

    useEffect(() => {
        mapRef.current?.flyTo({
            center: [coordinates[0], coordinates[1]],
            duration: 2000,
            zoom: 10.0,
        });
        // if (coordinates.length > 0) {
        //     setViewState({
        //         longitude: coordinates[0],
        //         latitude: coordinates[1],
        //         zoom: 10.0,
        //     });
        // }
    }, [coordinates]);

    console.log('coordinates', coordinates);

    const popup = useMemo(() => {
        return new mapboxgl.Popup().setOffset(10).setHTML(`
        <div>
            <h6>${location || 'Location'}</h6>
            </div>`);
    }, [location]);
    // <span>${coordinates?.[0]}</span>

    const togglePopup = useCallback(() => {
        markerRef.current?.togglePopup();
    }, []);

    // need this shit: https://visgl.github.io/react-map-gl/examples/viewport-animation

    // const onSelectCity = useCallback(({ longitude, latitude }) => {
    //     mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
    // }, []);

    // useEffect(() => {
    //     mapRef.current?.flyTo({
    //         center: [coordinates.longitude, coordinates.latitude],
    //         duration: 2000,
    //     });
    // }, [previewCoordinates]);

    // const flyto = useCallback(() => {
    //     console.log('flying to ', coordinates);

    //     mapRef.current?.flyTo({
    //         center: [coordinates.longitude, coordinates.latitude],
    //         duration: 2000,
    //     });
    // }, [coordinates]);

    /*
        const previewLocation = () => {
            console.log('inside preview location');

            axios
                .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${queryLocation}.json?access_token=${
                        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
                    }`,
                )
                .then(res => {
                    const coords = res.data.features[0].geometry.coordinates;
                    setCoordinates(prev => {
                        mapRef.current?.flyTo({
                            center: [coords[0], coords[1]],
                            duration: 2000,
                        });
                        return { longitude: coords[0], latitude: coords[1] };
                    });
                })
                .catch(err => {
                    // ... err msg
                });
        };
        */

    return (
        <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
                // ...coordinates,

                // longitude: coordinates[0],
                // latitude: coordinates[1],
                // zoom: 10,

                ...viewState,
            }}
            style={{ height: '300px' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            attributionControl={false}
            ref={mapRef}
            // zoom={viewState.zoom}
        >
            <NavigationControl />
            {/* <Marker {...coordinates} anchor="top" onClick={togglePopup} popup={popup}></Marker> */}

            {/* // TODO: new campground should not have marker for initial state. Display marker after user has picked a location. Display VIetnam map by default without marker in NewCampground */}
            {coordinates.length > 0 && (
                <Marker
                    longitude={coordinates[0]}
                    latitude={coordinates[1]}
                    anchor="top"
                    onClick={togglePopup}
                    popup={popup}
                ></Marker>
            )}
        </Map>
    );
};

export default memo(PreviewMap);
