import type { LayerProps } from 'react-map-gl';

export const clusterLayer: LayerProps = {
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': ['step', ['get', 'point_count'], '#91a4ff', 10, '#f1f075', 50, '#e87972'],
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

// icon-image values:
// [
//   "pedestrian-polygon",
//   "crosswalk-large",
//   "crosswalk-small",
//   "us-interstate-truck-2",
//   "us-interstate-truck-3",
//   "us-highway-business-2",
//   "us-highway-business-3",
//   "us-highway-bypass-2",
//   "us-highway-bypass-3",
//   "us-highway-truck-2",
//   "us-highway-truck-3",
//   "sa-highway-secondary-3",
//   "ae-f-route-3",
//   "ae-s-route-4",
//   "pe-national-2",
//   "pe-national-3",
//   "ae-national-3",
//   "ae-national-4",
//   "mashreq-network-2",
//   "ae-d-route-3",
//   "ae-d-route-4",
//   "jp-national-route-2",
//   "jp-national-route-3",
//   "tw-provincial-2",
//   "tw-provincial-3",
//   "tw-provincial-expy-2",
//   "tw-provincial-expy-3",
//   "za-provincial-2",
//   "cn-nths-expy-2",
//   "cn-nths-expy-3",
//   "cn-nths-expy-4",
//   "cn-nths-expy-5",
//   "cn-provincial-expy-2",
//   "cn-provincial-expy-3",
//   "cn-provincial-expy-4",
//   "cn-provincial-expy-5",
//   "qa-main-2",
//   "qa-main-3",
//   "qa-main-4",
//   "th-highway-2",
//   "th-highway-3",
//   "th-highway-4",
//   "th-motorway-2",
//   "th-motorway-toll-2",
//   "br-federal-3",
//   "hk-strategic-route-2",
//   "in-national-2",
//   "in-national-3",
//   "in-national-4",
//   "in-state-2",
//   "in-state-3",
//   "kr-natl-expy-2",
//   "kr-natl-expy-3",
//   "mx-federal-2",
//   "mx-federal-3",
//   "mx-federal-4",
//   "mx-state-2",
//   "mx-state-3",
//   "mx-state-4",
//   "pe-regional-3",
//   "pe-regional-4",
//   "tw-national-2",
//   "us-interstate-2",
//   "us-interstate-3",
//   "us-interstate-4",
//   "us-interstate-business-2",
//   "us-interstate-business-3",
//   "us-interstate-duplex-4",
//   "us-interstate-duplex-5",
//   "au-tourist-2",
//   "au-tourist-3",
//   "ar-national-2",
//   "ar-national-3",
//   "ar-national-4",
//   "au-national-highway-2",
//   "au-national-highway-3",
//   "au-national-route-2",
//   "au-national-route-3",
//   "au-national-route-4",
//   "au-national-route-5",
//   "au-national-route-6",
//   "au-state-2",
//   "au-state-3",
//   "au-state-4",
//   "au-state-5",
//   "au-state-6",
//   "br-state-2",
//   "br-state-3",
//   "ca-trans-canada-2",
//   "ca-trans-canada-3",
//   "circle-white-2",
//   "circle-white-3",
//   "circle-white-4",
//   "cl-highway-2",
//   "cl-highway-3",
//   "co-national-2",
//   "co-national-3",
//   "gate",
//   "hot-spring",
//   "hu-main-2",
//   "hu-main-3",
//   "hu-main-4",
//   "hu-main-5",
//   "hu-motorway-2",
//   "hu-motorway-3",
//   "lift-gate",
//   "marker",
//   "md-local-2",
//   "md-local-3",
//   "md-local-4",
//   "md-local-5",
//   "md-local-6",
//   "md-main-2",
//   "md-main-3",
//   "md-main-4",
//   "mountain",
//   "nz-state-2",
//   "nz-state-3",
//   "nz-urban-2",
//   "pe-departmental-3",
//   "ph-expressway-2",
//   "ph-primary-2",
//   "ph-primary-3",
//   "ro-communal-2",
//   "ro-communal-3",
//   "ro-communal-4",
//   "ro-county-3",
//   "ro-county-4",
//   "ro-national-2",
//   "ro-national-3",
//   "sa-highway-2",
//   "sa-highway-3",
//   "tw-county-township-2",
//   "tw-county-township-3",
//   "tw-county-township-4",
//   "tw-county-township-5",
//   "tw-county-township-6",
//   "us-bia-2",
//   "us-bia-3",
//   "us-bia-4",
//   "us-highway-2",
//   "us-highway-3",
//   "us-highway-4",
//   "us-highway-alternate-2",
//   "us-highway-alternate-3",
//   "us-highway-duplex-3",
//   "us-highway-duplex-4",
//   "us-highway-duplex-5",
//   "volcano",
//   "waterfall",
//   "za-national-2",
//   "za-national-3",
//   "barcelona-metro",
//   "boston-t",
//   "de-s-bahn",
//   "de-s-bahn.de-u-bahn",
//   "delhi-metro",
//   "id-national-2",
//   "kiev-metro",
//   "kr-metro-expy-2",
//   "kr-metro-expy-3",
//   "kr-metro-expy-4",
//   "madrid-metro",
//   "new-york-subway",
//   "oslo-metro",
//   "paris-metro",
//   "paris-metro.paris-rer",
//   "paris-rer",
//   "paris-rer.paris-transilien",
//   "road-closure",
//   "stockholm-metro",
//   "taipei-metro",
//   "vienna-u-bahn",
//   "il-highway-black-4",
//   "il-highway-blue-2",
//   "il-highway-blue-3",
//   "il-highway-green-3",
//   "il-highway-red-2",
//   "kr-natl-hwy-2",
//   "chongqing-rail-transit",
//   "de-u-bahn",
//   "hong-kong-mtr",
//   "jp-urban-expressway-2",
//   "jp-urban-expressway-3",
//   "mexico-city-metro",
//   "milan-metro",
//   "moscow-metro",
//   "osaka-subway",
//   "paris-transilien",
//   "philadelphia-septa",
//   "pk-motorway-2",
//   "pk-motorway-3",
//   "san-francisco-bart",
//   "singapore-mrt",
//   "tokyo-metro",
//   "traffic-signal",
//   "washington-metro",
//   "airfield",
//   "airport",
//   "al-motorway-2",
//   "alcohol-shop",
//   "american-football",
//   "amusement-park",
//   "aquarium",
//   "art-gallery",
//   "attraction",
//   "bakery",
//   "bank",
//   "bar",
//   "baseball",
//   "basketball",
//   "beach",
//   "beer",
//   "bicycle",
//   "bicycle-share",
//   "bowling-alley",
//   "bridge",
//   "bus",
//   "cafe",
//   "campsite",
//   "car",
//   "car-rental",
//   "car-repair",
//   "casino",
//   "castle",
//   "cemetery",
//   "ch-motorway-2",
//   "ch-motorway-3",
//   "charging-station",
//   "cinema",
//   "clothing-store",
//   "college",
//   "communications-tower",
//   "confectionery",
//   "convenience",
//   "cy-motorway-2",
//   "cy-motorway-3",
//   "de-motorway-2",
//   "de-motorway-3",
//   "dentist",
//   "doctor",
//   "dog-park",
//   "drinking-water",
//   "embassy",
//   "entrance",
//   "farm",
//   "fast-food",
//   "ferry",
//   "fire-station",
//   "fitness-centre",
//   "fuel",
//   "furniture",
//   "garden",
//   "gb-national-rail.london-dlr",
//   "gb-national-rail.london-dlr.london-overground.london-tfl-rail.london-underground",
//   "gb-national-rail.london-dlr.london-overground.london-underground",
//   "gb-national-rail.london-dlr.london-underground",
//   "gb-national-rail.london-overground",
//   "gb-national-rail.london-overground.london-tfl-rail.london-underground",
//   "gb-national-rail.london-overground.london-underground",
//   "gb-national-rail.london-tfl-rail",
//   "gb-national-rail.london-tfl-rail.london-overground",
//   "gb-national-rail.london-tfl-rail.london-underground",
//   "gb-national-rail.london-underground",
//   "globe",
//   "golf",
//   "gr-motorway-2",
//   "gr-motorway-3",
//   "gr-motorway-4",
//   "grocery",
//   "harbor",
//   "hardware",
//   "heliport",
//   "highway-rest-area",
//   "historic",
//   "horse-riding",
//   "hospital",
//   "hr-motorway-3",
//   "hr-motorway-4",
//   "ice-cream",
//   "industry",
//   "information",
//   "it-motorway-2",
//   "it-motorway-3",
//   "jewelry-store",
//   "jp-metropolitan-road-2",
//   "jp-metropolitan-road-3",
//   "jp-metropolitan-road-4",
//   "jp-prefectural-road-2",
//   "jp-prefectural-road-3",
//   "jp-prefectural-road-4",
//   "kr-metropolitan-2",
//   "kr-metropolitan-3",
//   "kr-metropolitan-4",
//   "kr-metropolitan-5",
//   "kr-metropolitan-6",
//   "landmark",
//   "laundry",
//   "library",
//   "lighthouse",
//   "lodging",
//   "london-dlr",
//   "london-dlr.london-tfl-rail",
//   "london-dlr.london-tfl-rail.london-underground",
//   "london-dlr.london-underground",
//   "london-overground",
//   "london-overground.london-tfl-rail",
//   "london-overground.london-tfl-rail.london-underground",
//   "london-overground.london-underground",
//   "london-tfl-rail",
//   "london-tfl-rail.london-underground",
//   "london-underground",
//   "mobile-phone",
//   "monument",
//   "museum",
//   "music",
//   "my-expressway-2",
//   "my-expressway-3",
//   "my-federal-2",
//   "my-federal-3",
//   "my-federal-4",
//   "my-state-2",
//   "my-state-3",
//   "my-state-4",
//   "observation-tower",
//   "optician",
//   "park",
//   "parking",
//   "parking-garage",
//   "pharmacy",
//   "picnic-site",
//   "pitch",
//   "pk-national-highway-2",
//   "pk-national-highway-3",
//   "place-of-worship",
//   "playground",
//   "police",
//   "post",
//   "prison",
//   "racetrack",
//   "racetrack-boat",
//   "racetrack-cycling",
//   "racetrack-horse",
//   "rail",
//   "rail-light",
//   "rail-metro",
//   "ranger-station",
//   "religious-buddhist",
//   "religious-christian",
//   "religious-jewish",
//   "religious-muslim",
//   "religious-shinto",
//   "restaurant",
//   "restaurant-bbq",
//   "restaurant-noodle",
//   "restaurant-pizza",
//   "restaurant-seafood",
//   "rocket",
//   "school",
//   "shoe",
//   "shop",
//   "si-motorway-2",
//   "skateboard",
//   "skiing",
//   "slipway",
//   "stadium",
//   "suitcase",
//   "swimming",
//   "table-tennis",
//   "tennis",
//   "theatre",
//   "toilet",
//   "toll",
//   "town-hall",
//   "tr-motorway-3",
//   "tr-motorway-4",
//   "tr-motorway-5",
//   "tr-motorway-6",
//   "tunnel",
//   "veterinary",
//   "viewpoint",
//   "volleyball",
//   "watch",
//   "watermill",
//   "wetland",
//   "windmill",
//   "zoo",
//   "level-crossing",
//   "oneway-large",
//   "oneway-white-large",
//   "default-2",
//   "default-3",
//   "default-4",
//   "default-5",
//   "default-6",
//   "gb-national-rail",
//   "intersection",
//   "jp-expressway-2",
//   "jp-expressway-3",
//   "motorway-exit-1",
//   "motorway-exit-2",
//   "motorway-exit-3",
//   "motorway-exit-4",
//   "motorway-exit-5",
//   "motorway-exit-6",
//   "motorway-exit-7",
//   "motorway-exit-8",
//   "motorway-exit-9",
//   "rectangle-blue-2",
//   "rectangle-blue-3",
//   "rectangle-blue-4",
//   "rectangle-blue-5",
//   "rectangle-blue-6",
//   "rectangle-green-2",
//   "rectangle-green-3",
//   "rectangle-green-4",
//   "rectangle-green-5",
//   "rectangle-green-6",
//   "rectangle-red-2",
//   "rectangle-red-3",
//   "rectangle-red-4",
//   "rectangle-red-5",
//   "rectangle-red-6",
//   "rectangle-white-2",
//   "rectangle-white-3",
//   "rectangle-white-4",
//   "rectangle-white-5",
//   "rectangle-white-6",
//   "rectangle-yellow-2",
//   "rectangle-yellow-3",
//   "rectangle-yellow-4",
//   "rectangle-yellow-5",
//   "rectangle-yellow-6",
//   "border-dot-13",
//   "oneway-small",
//   "oneway-white-small",
//   "dot-10",
//   "dot-11",
//   "dot-9",
//   "cliff"
// ]