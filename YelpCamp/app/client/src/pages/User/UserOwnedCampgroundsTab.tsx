import React from 'react';
import { Link } from 'react-router-dom';
import { Campground } from '../../types';
import CampgroundCard from '../Campground/CampgroundCard';
import CampgroundsContainer from '../../components/CampgroundsContainer';

interface TabProps {
    ownedCampgrounds: Campground[];
}

const UserOwnedCampgroundsTab: React.FC<TabProps> = ({ ownedCampgrounds }) => {
    return (
        <div>
            <div className="mb-5">
                <h1>Owned campgrounds</h1>
                <p className="text-muted">
                    You're currently hosting {ownedCampgrounds.length}{' '}
                    {ownedCampgrounds.length > 1 ? 'campgrounds.' : 'campground.'}
                </p>
                <hr />
            </div>

            {ownedCampgrounds.length > 0 ? (
                <CampgroundsContainer length={ownedCampgrounds.length}>
                    {ownedCampgrounds.map(campground => (
                        <CampgroundCard key={campground._id} campground={campground} />
                    ))}
                </CampgroundsContainer>
            ) : (
                <p>
                    You currently have no campground. Create one{' '}
                    <Link to="/campgrounds/new">here</Link>.
                </p>
            )}
        </div>
    );
};

export default UserOwnedCampgroundsTab;
