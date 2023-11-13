import React from 'react';
import { Link } from 'react-router-dom';
import { Campground } from '../../types';
import CampgroundCard from '../Campground/CampgroundCard';
import CampgroundsContainer from '../../components/CampgroundsContainer';

interface TabProps {
    ownedCampgrounds: Campground[];
}

const UserOwnedCampgroundsTab: React.FC<TabProps> = ({ ownedCampgrounds }) => {
    console.log(ownedCampgrounds);

    return (
        <div>
            <h1 className="mb-4">Owned campgrounds</h1>

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
