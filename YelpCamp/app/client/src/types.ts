export interface Campground {
    _id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    image: string;
}

export interface Review {
    _id: string;
    comment: string;
    rating: number;
    campground: string;
};