import React from 'react';
import { Link } from 'react-router-dom';
import CampgroundsContainer from '../../components/CampgroundsContainer';
import CampgroundCard from '../Campground/CampgroundCard';
import styled from '@emotion/styled';
import { Campground } from '../../types';

interface TabProps {
    favoritedCampgrounds: Campground[];
}

const UserFavoriteCampgroundsTab: React.FC<TabProps> = ({ favoritedCampgrounds }) => {
    return (
        <div>
            <h1 className="mb-4">Favorite campgrounds</h1>

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
