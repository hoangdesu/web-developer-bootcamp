import React from 'react';
import { Link } from 'react-router-dom';

const UserFavoriteCampgroundsTab = ({ favoritedCampgrounds }) => {
    return (
        <div>
            <h1>Favorite campgrounds</h1>

            <ol>
                {favoritedCampgrounds.map(campground => (
                    <li key={campground._id}>
                        <div className="">
                            <Link to={`/campgrounds/${campground._id}`}>
                                <h5>{campground.title}</h5>
                                <p>{campground.location}</p>
                                <img src={campground.images[0].url} alt="" width="200xp" />
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default UserFavoriteCampgroundsTab;
