import React from 'react';
import { Link } from 'react-router-dom';

interface PopupBoxProps {
    campground: {
        id: string;
        title: string;
        price: number;
        location: string;
        image: string;
        rating: number;
    };
}

const PopupBox: React.FC<PopupBoxProps> = ({ campground }) => {
    return (
        <Link
            to={`/campgrounds/${campground.id}`}
            className="flex flex-row gap-3 no-underline text-inherit"
        >
            <img src={campground.image} alt="Campground cover" className="w-[120px] object-cover" />
            <div className="flex flex-col w-[150px]">
                <h6 className=" mb-1">{campground.title}</h6>
                <span className="text-muted text-xs">{campground.location}</span>
                <span className="my-0">★ {campground.rating}</span>
                <span className="mt-0 font-bold">${campground.price}</span>
            </div>
        </Link>
    );
};

export default PopupBox;
