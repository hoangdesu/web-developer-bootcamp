import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
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
import type { MapRef, MapboxStyle } from 'react-map-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layers';
import { Campground } from '../../types';
import mapboxgl from 'mapbox-gl';
import { averageRating } from '../../helpers/campground';
import PopupBox from './PopupBox';

interface ClusterMapProps {
    campgrounds: Campground[];
}

interface PopupInfoType {
    campground: Pick<Campground, '_id' | 'title' | 'price' | 'location'> & {
        image: string;
        rating: number;
    };
    longitude: number;
    latitude: number;
}

const ClusterMap: React.FunctionComponent<ClusterMapProps> = ({ campgrounds }) => {
    const mapRef = useRef<MapRef>(null);
    const [popupInfo, setPopupInfo] = useState<PopupInfoType | null>(null);
    const [viewState, setViewState] = useState({
        longitude: 107.7017555,
        latitude: 16.0, // default coordinate to Vietnam
        zoom: 4,
    });
    const [cursor, setCursor] = useState<'pointer' | 'grab' | 'grabbing'>('grab');

    const clusterData = {
        features: campgrounds.map(campground => ({
            type: 'Feature',
            properties: {
                _id: campground._id,
                title: campground.title,
                location: campground.location,
                image: campground.images[0].url,
                price: campground.price,
                rating: averageRating(campground),
            },
            geometry: campground.geometry,
        })),
    };

    // imperative onclick
    // mapRef.current?.on('click', 'unclustered-point', function (e) {
    //     console.log('unclustered:', e.features?.[0].geometry.coordinates);
    //     new mapboxgl.Popup({ offset: 20 })
    //         .setLngLat(e.features?.[0].geometry.coordinates)
    //         .setHTML(`hi`);
    // });

    const onMapClick = (event: mapboxgl.MapMouseEvent | any) => {
        const feature = event.features[0];

        // clicking outside the interactive zones
        if (!feature) {
            setPopupInfo(null);
            return;
        }

        const clusterId = feature?.properties?.cluster_id;

        if (clusterId) {
            // clicking on a cluster
            const mapboxSource = mapRef.current?.getSource('campgrounds') as mapboxgl.GeoJSONSource;

            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                mapRef.current?.easeTo({
                    center: feature.geometry.coordinates,
                    zoom,
                    duration: 500,
                });
            });
        } else {
            // clicking on a single campground
            event.originalEvent.stopPropagation();
            setPopupInfo({
                campground: feature.properties,
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
            });
        }

        // TODO: fix clicking on consecutive single campground does NOT show popup, just marker :/ ?
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
    }, []);

    return (
        <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
                ...viewState,
            }}
            style={{ height: 450 }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            attributionControl={false}
            interactiveLayerIds={[clusterLayer.id!, unclusteredPointLayer.id!]}
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
                            onClose={() => setPopupInfo(null)}
                            closeOnClick={true}
                            maxWidth="300px"
                        >
                            <PopupBox campground={popupInfo.campground} />
                        </Popup>

                        <Marker longitude={popupInfo.longitude} latitude={popupInfo.latitude} />
                    </>
                )}
            </Source>
        </Map>
    );
};

export default memo(ClusterMap);
