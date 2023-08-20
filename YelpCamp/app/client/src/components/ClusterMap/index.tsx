import React, { useRef } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import type { MapRef, GeoJSONSource } from 'react-map-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layers';

const ClusterMap = ({ campgrounds }) => {
    const mapRef = useRef<MapRef>(null);

    // console.log('clustermap: ', campgrounds);
    const clusterData = {};

    clusterData.features = campgrounds.map(campground => ({
        type: 'Feature',
        properties: {
            id: campground._id
        },
        geometry: campground.geometry
    }));
    
    console.log("🚀 ~ file: index.tsx:17 ~ clusterData ~ clusterData:", clusterData)
    

    const onClick = event => {
        const feature = event.features[0];
        const clusterId = feature.properties.cluster_id;

        const mapboxSource = mapRef.current.getSource('campgrounds') as GeoJSONSource;

        mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) {
                return;
            }

            mapRef.current.easeTo({
                center: feature.geometry.coordinates,
                zoom,
                duration: 500,
            });
        });
    };
    return (
        <>
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    longitude: 107.7017555,
                    latitude: 16.0, // default coordinate to vietnam
                    zoom: 4,
                }}
                style={{ width: '100%', height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
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
                </Source>
            </Map>
        </>
    );
};

export default ClusterMap;
