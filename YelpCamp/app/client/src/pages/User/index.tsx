import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from '../../config/yelpcampAxios';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import { Button, Form } from 'react-bootstrap';
import Loading from '../Loading';
import { Campground } from '../../types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import styled from '@emotion/styled';
import AppContext from '../../store/app-context';
import UserUpdateInfoTab from './UserUpdateInfoTab';
import UserFavoriteCampgroundsTab from './UserFavoriteCampgroundsTab';
import UserReservationsTab from './UserReservationsTab';
import UserOwnedCampgroundsTab from './UserOwnedCampgroundsTab';
import SecondaryTransparentButton from '../../components/Buttons/SecondaryTransparentButton';

export async function loader({ params }) {
    return { username: params.username };
}

type ActiveTabType = 'userInfo' | 'ownedCampgrounds' | 'favoritedCampgrounds' | 'reservations';

interface ILoaderData {
    username: string;
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 50px;
    margin-bottom: 50px;
    /* border-right: 1px solid red; */

    .tabs {
        width: 250px;
        /* position: absolute; */
        /* z-index: 1; */
        /* border-right: 1px solid black; */
        /* margin-top: 4rem; */
        /* margin-top: 1rem; */

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
            /* height: auto;
            width: auto; */
            border-radius: 6px;
        }

        li {
            padding: 10px;
        }

        li:hover {
            cursor: pointer;
            background-color: #e9dddd;
            /* text-decoration: underline; */
        }
    }

    .content {
        /* width: fit-content; */
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
        background: #e5dadc;
        /* height: 100vh; */
        display: flex;
        flex-direction: column;

        .tabs {
            /* width: 250px; */
            width: 100%;
            /* position: absolute; */
            /* z-index: 1; */
            /* border-right: 1px solid black; */
            /* margin-top: 4rem; */
            /* margin-top: 1rem; */

            ul {
                display: flex;
                flex-direction: row;
                gap: 1px;
            }

            li {
                /* width: ; */
                list-style: none;
                padding: 0;
                margin: 0;
                transition: 100ms all ease-out;
                /* height: auto;
            width: auto; */
                border-radius: 6px;
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
    const { height, width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<ActiveTabType>('userInfo');
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

    if (error) return <p>Error. User not found</p>;

    console.log('user', user);

    /* TODO: ADD AUTH TO ONLY ALLOW CORRECT LOGGEDIN USER TO SEE CERTAIN PARTS OF THE PAGE. HIDE SOME PARTS (RESERVATIONS) FROM OUTSIDER */

    return (
        <PageContainer>
            {/* NEW UI */}
            {/* Recreate this: https://ui.shadcn.com/examples/forms/account */}
            <Container>
                {/* tab */}
                {width > 768 ? (
                    <div className="tabs">
                        <ul>
                            {TABS.map(tab => (
                                <li
                                    key={tab.id}
                                    onClick={() => {
                                        // setActiveTab(tab.id as ActiveTabType);
                                        setSearchParams({ tab: tab.id }, { replace: true });
                                    }}
                                    className={`${tab.id === searchParams.get('tab') && 'active'} `}
                                >
                                    <span>{tab.title}</span>
                                </li>
                            ))}
                        </ul>
                        {/* debug area */}
                        <div className="mt-[200px]">
                            <SecondaryTransparentButton onClick={() => navigate(-1)}>
                                (//left arrow) Back
                            </SecondaryTransparentButton>
                        </div>
                    </div>
                ) : (
                    // <button>Show tabs</button>
                    <div className="bg-red-500">
                        <ul className="flex flex-col overflow-x-auto">
                            {TABS.map(tab => (
                                <li
                                    key={tab.id}
                                    onClick={() => {
                                        // setActiveTab(tab.id as ActiveTabType);
                                        setSearchParams({ tab: tab.id }, { replace: true });
                                    }}
                                    className={`${
                                        tab.id === searchParams.get('tab') && 'active'
                                    } w-fit`}
                                >
                                    <span>{tab.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* content */}
                <div className="content">
                    {!searchParams.get('tab') ||
                        (searchParams.get('tab') === 'info' && <UserUpdateInfoTab user={user} />)}

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
            </Container>
        </PageContainer>
    );
};

export default User;

// tutorial:
// https://codepen.io/hoangdesu/pen/poqpLKP
// https://www.youtube.com/watch?v=rHdfxfuC_8U&ab_channel=WEBCIFAR
