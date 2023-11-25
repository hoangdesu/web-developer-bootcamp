import type { LayerProps } from 'react-map-gl';

export const clusterLayer: LayerProps = {
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#f0f76a',
            10, // yellow-ish color for clusters of 0-10
            '#baba99',
            20, // pink-ish color for clusters of 10-20 //
            '#6ba2db', //  purple-ish color for clusters of more than 20
        ],
        'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 50, 25],
    },
};

export const clusterCountLayer: LayerProps = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
    },
};

export const unclusteredPointLayer: LayerProps = {
    id: 'unclustered-point',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'icon-image': 'park',
        'icon-size': 2,
    },
};
