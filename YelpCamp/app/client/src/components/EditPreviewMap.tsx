import React, {
    useRef,
    useMemo,
    useCallback,
    useEffect,
    useState,
    useImperativeHandle,
} from 'react';
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

import { Campground } from '../types';
import axios from 'axios';

interface EditPreviewMapProps {
    campground: Campground;
    queryLocation: string;
}

// TODO: FIX THIS MTFK, REMOVE REFS AND IMPERATIVE HANDLE, PASS PROPS AND HANDLER FROM OUTSIDE
// BRING THE AXIOS OUTSIDE
const EditPreviewMap: React.FunctionComponent<EditPreviewMapProps> = React.forwardRef(
    ({ campground, queryLocation }, ref) => {
        const mapRef = useRef<MapRef>();
        const markerRef = useRef<mapboxgl.Marker>();

        const [coordinates, setCoordinates] = useState({
            longitude: campground.geometry.coordinates[0],
            latitude: campground.geometry.coordinates[1],
        });

        useEffect(() => {
            mapRef.current?.flyTo({
                center: [coordinates.longitude, coordinates.latitude],
                duration: 2000,
            });
        }, [coordinates, queryLocation]);

        console.log('coordinates', coordinates);
        console.log('queryLocation', queryLocation);

        const popup = useMemo(() => {
            return new mapboxgl.Popup().setOffset(10).setHTML(`
        <div>
            <h6>${campground.location}</h6>
            <span>${coordinates.longitude}, ${coordinates.latitude}</span>
        </div>`);
        }, []);

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

        useImperativeHandle(
            ref,
            () => {
                return {
                    previewLocation: previewLocation,
                    // () {
                    //     console.log('IMPERATIVE')
                    //     axios
                    //         .get(
                    //             `https://api.mapbox.com/geocoding/v5/mapbox.places/${queryLocation}.json?access_token=${
                    //                 import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
                    //             }`,
                    //         )
                    //         .then(res => {
                    //             const coords = res.data.features[0].geometry.coordinates;
                    //             setCoordinates({ longitude: coords[0], latitude: coords[1] });
                    //         })
                    //         .catch(err => {
                    //             // ... err msg
                    //         });
                    // },
                };
            },
            [coordinates, setCoordinates],
            // []
        );

        return (
            <div>
                <button type="button" onClick={previewLocation}>
                    fly to place
                </button>
                <Map
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    initialViewState={{
                        ...coordinates,
                        zoom: 8,
                    }}
                    style={{ height: '262px' }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    attributionControl={false}
                    ref={mapRef}
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
    },
);

export default EditPreviewMap;
