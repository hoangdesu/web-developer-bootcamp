import React, { useContext, useEffect } from 'react';
import axios from '../../config/yelpcampAxios';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import Loading from '../Loading';
import styled from '@emotion/styled';
import AppContext from '../../store/app-context';
import UserUpdateInfoTab from './UserUpdateInfoTab';
import UserFavoriteCampgroundsTab from './UserFavoriteCampgroundsTab';
import UserReservationsTab from './UserReservationsTab';
import UserOwnedCampgroundsTab from './UserOwnedCampgroundsTab';
import ErrorBoundary from '../ErrorBoundary';
import CampgroundsContainer from '../../components/CampgroundsContainer';
import CampgroundCard from '../Campground/CampgroundCard';
import { Campground } from '../../types';

export async function loader({ params }) {
    return { username: params.username };
}

interface ILoaderData {
    username: string;
}

const Container = styled.div`
    margin-bottom: 50px;

    .author-view {
        display: flex;
        flex-direction: row;
        gap: 50px;

        .tabs {
            width: 250px;

            ul {
                display: flex;
                flex-direction: column;
                gap: 1px;
            }

            ul,
            li {
                list-style: none;
                padding: 0;
                margin: 0;
                transition: 100ms all ease-out;
                width: auto;
                border-radius: 6px;
            }

            li {
                padding: 10px;
                white-space: nowrap;
            }

            li:hover {
                cursor: pointer;
                background-color: #e9dddd;
            }
        }

        .content {
            width: 100%;
        }

        .active {
            cursor: pointer;
            background: var(--primary-accent-color) !important;
            text-decoration: none !important;
            color: white;
        }

        /* MOBILE VIEW */
        @media (max-width: 768px) {
            display: flex;
            flex-direction: column;

            .tabs {
                width: 100%;

                ul {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                    overflow-x: scroll;
                }

                li {
                    width: fit-content;
                    list-style: none;
                    padding: 10px;
                    margin: 0;
                    transition: 100ms all ease-out;
                    border-radius: 6px;
                }
            }
        }
    }
`;

const TABS = [
    {
        id: 'info',
        title: 'User info',
    },
    {
        id: 'owned',
        title: 'Owned campgrounds',
    },
    {
        id: 'favorite',
        title: 'Favorite campgrounds',
    },
    {
        id: 'reservations',
        title: 'Reservations',
    },
];

const User = () => {
    const { username } = useLoaderData() as ILoaderData;
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        appContext.setModal({ open: false, content: null, requiresLoggedIn: false });
        appContext.setSnackbar(false);
        if (!searchParams.get('tab')) setSearchParams({ tab: 'info' });
    }, []);

    const {
        isLoading,
        error,
        data: user,
        refetch,
    } = useQuery({
        queryKey: ['userData'],
        queryFn: () => axios.get(`/api/v1/users/username/${username}`).then(res => res.data),
        onSuccess: user => {
            document.title = `YelpCamp | ${user.username}`;
        },
    });

    if (isLoading) return <Loading />;

    if (error) return <ErrorBoundary err={error} />;

    return (
        <PageContainer>
            <Container>
                {appContext.currentUser?.username === user.username ? (
                    // Author's view
                    <div className="author-view">
                        <div className="tabs">
                            <ul>
                                {TABS.map(tab => (
                                    <li
                                        key={tab.id}
                                        onClick={() => {
                                            setSearchParams({ tab: tab.id }, { replace: true });
                                        }}
                                        className={`${
                                            tab.id === searchParams.get('tab') && 'active'
                                        } `}
                                    >
                                        <span>{tab.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* content */}
                        <div className="content">
                            {!searchParams.get('tab') ||
                                (searchParams.get('tab') === 'info' && (
                                    <UserUpdateInfoTab user={user} refetch={refetch} />
                                ))}

                            {searchParams.get('tab') === 'owned' && (
                                <UserOwnedCampgroundsTab ownedCampgrounds={user.campgrounds} />
                            )}

                            {searchParams.get('tab') === 'favorite' && (
                                <UserFavoriteCampgroundsTab
                                    favoritedCampgrounds={user.favoritedCampgrounds}
                                />
                            )}

                            {searchParams.get('tab') === 'reservations' && (
                                <UserReservationsTab reservations={user.reservations} />
                            )}
                        </div>
                    </div>
                ) : (
                    // Guest's view
                    <div>
                        <h1>User</h1>
                        <hr />

                        <div className="mb-5">
                            <h3>Contact information</h3>
                            <div>Username: {user.username}</div>
                            <div>Email address: {user.email}</div>
                        </div>

                        <div>
                            <h3>Owned campgrounds</h3>
                            <p className="text-muted text-sm">
                                {user.campgrounds.length} campgrounds
                            </p>
                            <div className="mt-3">
                                {user.campgrounds.length > 0 && (
                                    <CampgroundsContainer length={user.campgrounds.length}>
                                        {user.campgrounds.map((campground: Campground) => (
                                            <CampgroundCard
                                                key={campground._id}
                                                campground={campground}
                                            />
                                        ))}
                                    </CampgroundsContainer>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </PageContainer>
    );
};

export default User;
