import type { LayerProps } from 'react-map-gl';

export const clusterLayer: LayerProps = {
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': ['step', ['get', 'point_count'], '#91a4ff', 10, '#f1f075', 50, '#e87972'], // TODO: change cluster colors to match styling of app
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

// export const unclusteredPointLayer: LayerProps = {
//     id: 'unclustered-point',
//     type: 'circle',
//     source: 'campgrounds',
//     filter: ['!', ['has', 'point_count']],
//     paint: {
//         'circle-color': '#11b4da',
//         'circle-radius': 6,
//         'circle-stroke-width': 2,
//         'circle-stroke-color': '#fff',
//     },
// };

export const unclusteredPointLayer: LayerProps = {
    id: 'unclustered-point',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    layout: {
      // 'text-field': '{title}',
      'icon-image': 'park',
      'icon-size': 2,
      // 'icon-op'
      // 'text-field': ['get', 'id'],

    },
    // sprite:
};
