import React from 'react';

export interface Campground {
    _id: string;
    title: string;
    price: number;
    description?: string;
    location: string;
    geometry: Point;
    images: Image[];
    author: User;
    reviews: Review[];
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
    coordinates: [number, number];
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
}

export interface Modal {
    open: boolean;
    content: React.ReactNode | React.ReactElement | null;
    requiresLoggedIn?: boolean;
}

export type TSeverity = 'info' | 'success' | 'warning' | 'error';

export interface Snackbar {
    isOpen: boolean;
    message?: string;
    severity?: TSeverity;
}

export interface Reservation {
    _id: string;
    bookedBy: {
        _id: string;
        email: string;
        username: string;
    };
    campground: Campground;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    totalAmount: number;
    discount: {
        code: string;
        percentage: number;
    };
    status?: 'PENDING' | 'PAID' | 'CANCELLED';
}

export interface UploadImage {
    id: string;
    file: File | Blob;
}

export interface MapboxFeature {
    center: [number, number];
    geometry: Point;
    id: string;
    place_name: string;
    text: string;
    type: 'Feature';
    bbox: number[];
}
