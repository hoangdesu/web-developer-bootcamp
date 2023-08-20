export interface Campground {
    _id: string;
    title: string;
    price: number;
    description?: string;
    location: string;
    geometry: Point;
    images: Image[];
    author: User;
    reviews: Review;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    url: string;
    filename: string;
    thumbnail?: string;
}

export interface Review {
    _id: string;
    comment: string;
    rating: number;
    campground: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}

export interface Alert {
    message: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export interface User {
    id: string;
    username: string;
    email: string;
}

interface Point {
    type: 'Point';
    coordinates: number[];
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
}
