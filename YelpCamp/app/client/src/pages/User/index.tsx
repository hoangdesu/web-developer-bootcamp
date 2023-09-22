import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import { Button, Form } from 'react-bootstrap';
import Loading from '../Loading';
import { Campground } from '../../types';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import styled from '@emotion/styled';
import AppContext from '../../store/app-context';
import UserUpdateInfo from './UserUpdateInfo';

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

    .tabs {
        width: 300px;
        /* position: absolute; */
        /* z-index: 1; */
        /* border-right: 1px solid black; */
        /* margin-top: 4rem; */
        /* margin-top: 1rem; */

        ul {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
            /* background-color: gray; */
            text-decoration: underline;
        }
    }

    .content {
        width: fit-content;
    }

    .active {
        cursor: pointer;
        background: pink !important;
        text-decoration: none !important;
    }
`;

// TODO: rename these attributes + ids
const TABS = [
    {
        id: 'userInfo',
        title: 'User info',
    },
    {
        id: 'ownedCampgrounds',
        title: 'Owned campgrounds',
    },
    {
        id: 'favoritedCampgrounds',
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
            setSearchParams({ tab: 'userInfo' });
        },
    });

    if (isLoading) return <Loading />;

    if (error) return <p>Error. User not found</p>;

    console.log('user', user);

    return (
        <PageContainer>
            {/* NEW UI */}
            {/* Recreate this: https://ui.shadcn.com/examples/forms/account */}
            <Container className="flex flex-row tab">
                {/* tab */}
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
                        <p>
                            Screen width: {width} - Height: {height}
                        </p>

                        <p>{width < 768 ? 'MOBILE' : 'LAPTOP'} SCREEN</p>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </div>
                </div>

                {/* content */}
                <div className="content">
                    {!searchParams.get('tab') ||
                        (searchParams.get('tab') === 'userInfo' && <UserUpdateInfo user={user} />)}

                    {searchParams.get('tab') === 'ownedCampgrounds' && (
                        <div>
                            <h1>Owned campgrounds</h1>
                            <ol>
                                {user.campgrounds.map((campground: Campground) => (
                                    <li key={campground._id}>
                                        <Link to={`/campgrounds/${campground._id}`}>
                                            {campground.title} (${campground.price})
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {searchParams.get('tab') === 'favoritedCampgrounds' && (
                        <div>
                            <h1>Favorite campgrounds</h1>
                            <ol>
                                {user.favoritedCampgrounds.map(campground => (
                                    <li key={campground._id}>
                                        <div className="">
                                            <Link to={`/campgrounds/${campground._id}`}>
                                                <h5>{campground.title}</h5>
                                                <p>{campground.location}</p>
                                                <img
                                                    src={campground.images[0].url}
                                                    alt=""
                                                    width="200xp"
                                                />
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {searchParams.get('tab') === 'reservations' && (
                        <div>
                            <h1>Reservations</h1>
                            <ol>
                                {user.reservations &&
                                    user.reservations.map(resv => {
                                        return (
                                            <li key={resv._id}>
                                                <div>
                                                    <p>Bookedby: {resv.bookedBy}</p>
                                                    <p>Campground: {resv.campground}</p>
                                                    <p>Checkin: {resv.checkIn}</p>
                                                    <p>checkOut: {resv.checkOut}</p>
                                                    <p>
                                                        Nights: {resv.nights} - guests:{' '}
                                                        {resv.guests}
                                                    </p>
                                                    <p>
                                                        totalPrice: {resv.totalPrice} - status:{' '}
                                                        {resv.status}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Link to={`/reservation/${resv._id}`}>
                                                        {resv._id}
                                                    </Link>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ol>
                        </div>
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
