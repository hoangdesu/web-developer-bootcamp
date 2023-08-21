import React, { useState, useRef, useEffect, useCallback } from 'react';
import Map, {
    Source,
    Layer,
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    GeolocateControl,
    useMap,
} from 'react-map-gl';
import type { MapRef, GeoJSONSource } from 'react-map-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layers';
import { Campground } from '../../types';
import { Link } from 'react-router-dom';

interface ClusterMapProps {
    campgrounds: Campground[];
}

const ClusterMap: React.FunctionComponent<ClusterMapProps> = ({ campgrounds }) => {
    const mapRef = useRef<MapRef>(null);
    // const { current: map }= useMap();
    const [popupInfo, setPopupInfo] = useState(null);

    const [viewState, setViewState] = useState({
        longitude: 107.7017555,
        latitude: 16.0, // default coordinate to vietnam
        zoom: 4,
    });
    const [cursor, setCursor] = useState<string>('grab');

    const clusterData = {
        features: campgrounds.map(campground => ({
            type: 'Feature',
            properties: {
                id: campground._id,
                title: campground.title,
                location: campground.location,
                image: campground.images[0].url,
                price: campground.price,
                // rating: // avg rating
            },
            geometry: campground.geometry,
        })),
    };

    // console.log("🚀 ~ file: index.tsx:17 ~ clusterData ~ clusterData:", clusterData)

    // imperative onclick
    // mapRef.current?.on('click', 'unclustered-point', function (e) {
    //     console.log('unclustered:', e.features?.[0].geometry.coordinates);
    //     new mapboxgl.Popup({ offset: 20 })
    //         .setLngLat(e.features?.[0].geometry.coordinates)
    //         .setHTML(`hi`);
    // });

    const onMapClick = event => {
        const feature = event.features[0];

        // clicking outside the interactive zones
        if (!feature) {
            setPopupInfo(null);
            return;
        }

        const clusterId = feature?.properties?.cluster_id;

        if (clusterId) {
            const mapboxSource = mapRef.current.getSource('campgrounds') as GeoJSONSource;

            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                console.log('cluster id:', clusterId);
                if (err) return;

                mapRef.current?.easeTo({
                    center: feature.geometry.coordinates,
                    zoom,
                    duration: 500,
                });
            });
        } else {
            console.log(feature.properties);
            setPopupInfo({
                campground: feature.properties,
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
            });
        }

        console.log(popupInfo);
    };

    const onMove = useCallback(evt => {
        setViewState(prev => ({ ...prev, ...evt.viewState }));
    }, []);

    // imperative way of setting cursor
    // mapRef.current?.on('mouseenter', 'clusters', function () {
    //     mapRef.current!.getCanvas().style.cursor = 'pointer';
    // });

    // mapRef.current?.on('mouseleave', 'clusters', function () {
    //     mapRef.current!.getCanvas().style.cursor = '';
    // });

    // setting cursors :))
    const onMouseEnter = useCallback(() => setCursor('pointer'), []);
    const onMouseLeave = useCallback(() => setCursor('grab'), []);
    const onDrag = useCallback(() => setCursor('grabbing'), []);
    const onDragEnd = useCallback(() => setCursor('grab'), []);

    const onMapLoad = useCallback(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            setViewState(viewState => ({
                ...viewState,
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude,
            }));

            mapRef.current?.flyTo({
                center: [pos.coords.longitude, pos.coords.latitude],
                duration: 2000,
                zoom: 8,
            });
        });

        // console.log(mapRef.current?.listImages());

        // mapRef.current.on('move', () => {
        //     console.log('moving ');

        // });

        // mapRef.current?.addLayer({
        //     id: "bus-stops-symbol",
        //     type: "symbol",
        //     source: "bus-stops",
        //       layout: {
        //           'icon-image': 'bus-15',
        //        }
        //   });

        //   mapRef.current.add
        // const map = mapRef.current.getMap();
        // map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error, image) => {
        //     if (error) throw error;

        //     console.log('got the pussy');

        //     // Add the image to the map style.
        //     map.addImage('cat', image);
        // });
    }, []);

    return (
        <>
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    ...viewState,
                }}
                // {...viewState}
                // onMove={onMove}
                style={{ width: '100%', height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                attributionControl={false}
                interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
                onClick={onMapClick}
                ref={mapRef}
                onLoad={onMapLoad}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                cursor={cursor}
            >
                <GeolocateControl />
                <FullscreenControl />
                <NavigationControl />
                <Source
                    id="campgrounds"
                    type="geojson"
                    data={clusterData}
                    cluster={true}
                    clusterMaxZoom={14}
                    clusterRadius={50}
                >
                    <Layer {...clusterLayer} />
                    <Layer {...clusterCountLayer} />
                    <Layer {...unclusteredPointLayer} />

                    {popupInfo && (
                        <>
                            <Popup
                                anchor="bottom"
                                longitude={popupInfo.longitude}
                                latitude={popupInfo.latitude}
                                offset={30}
                                onClose={e => {
                                    console.log('pop', e);
                                    setPopupInfo(null);
                                }}
                                // onClick={e => {
                                //     e.originalEvent.stopPropagation();
                                // }}
                            >
                                <div>
                                    <div
                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <h6>{popupInfo.campground.title}</h6>

                                        {/* <span>{popupInfo.campground.rating}</span> */}
                                        <span>${popupInfo.campground.price}</span>
                                    </div>
                                    <span>{popupInfo.campground.location}</span>

                                    <img
                                        src={popupInfo.campground.image}
                                        alt=""
                                        style={{
                                            width: '150px',
                                            height: '100px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <br />
                                    <Link to={`/campgrounds/${popupInfo.campground.id}`}>
                                        View this campground
                                    </Link>
                                </div>
                            </Popup>

                            <Marker
                                longitude={popupInfo.longitude}
                                latitude={popupInfo.latitude}
                                // onClick={e => {
                                //     e.originalEvent.stopPropagation();
                                // }}

                                // onClick={togglePopup}

                                // setPopupInfo(city);
                            />
                        </>
                    )}

                    {/* {campgrounds.map(campground => (
                        <Marker
                            longitude={campground.geometry.coordinates[0]}
                            latitude={campground.geometry.coordinates[1]}
                            anchor="top"
                        >
                            <svg
                                height={20}
                                viewBox="0 0 24 24"
                                style={{ cursor: 'pointer', fill: '#d00', stroke: 'none' }}
                            >
                                <path
                                    d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`}
                                />
                            </svg>
                        </Marker>
                    ))} */}
                </Source>
            </Map>
        </>
    );
};

export default ClusterMap;
