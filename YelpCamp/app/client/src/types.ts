export interface Campground {
    _id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    image: string;
    author: User;
    reviews: Review;
}

export interface Review {
    _id: string;
    comment: string;
    rating: number;
    campground: string;
    author: User;
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

