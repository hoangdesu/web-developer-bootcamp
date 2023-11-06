import React from 'react';
import { Link } from 'react-router-dom';
import { Campground } from '../../types';

const UserOwnedCampgroundsTab = ({ ownedCampgrounds }) => {
    return (
        <div>
            <h1>Owned campgrounds</h1>
            <ol>
                {ownedCampgrounds.map((campground: Campground) => (
                    <li key={campground._id}>
                        <Link to={`/campgrounds/${campground._id}`}>
                            {campground.title} (${campground.price})
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default UserOwnedCampgroundsTab;
