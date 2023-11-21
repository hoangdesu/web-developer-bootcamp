import React from 'react';
import { Link } from 'react-router-dom';
import CampgroundsContainer from '../../components/CampgroundsContainer';
import CampgroundCard from '../Campground/CampgroundCard';
import { Campground } from '../../types';

interface TabProps {
    favoritedCampgrounds: Campground[];
}

const UserFavoriteCampgroundsTab: React.FC<TabProps> = ({ favoritedCampgrounds }) => {
    return (
        <div>
            <div className="mb-5">
                <h1>Favorite campgrounds</h1>
                <p className="text-muted">
                    You currently have {favoritedCampgrounds.length} favorite{' '}
                    {favoritedCampgrounds.length > 1 ? 'campgrounds.' : 'campground.'}
                </p>
                <hr />
            </div>

            {favoritedCampgrounds.length > 0 ? (
                <CampgroundsContainer length={favoritedCampgrounds.length}>
                    {favoritedCampgrounds.map(campground => (
                        <CampgroundCard key={campground._id} campground={campground} />
                    ))}
                </CampgroundsContainer>
            ) : (
                <p>
                    Your favorite campground list is empty.{' '}
                    <Link to="/">Start exploring campgrounds!</Link>
                </p>
            )}
        </div>
    );
};

export default UserFavoriteCampgroundsTab;
