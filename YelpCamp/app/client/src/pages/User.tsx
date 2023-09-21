import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { Button } from 'react-bootstrap';
import Loading from './Loading';
import { Campground } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';
import styled from '@emotion/styled';
import PageModal from '../components/Modals/PageModal';
import AppContext from '../store/app-context';

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
    gap: 30px;
    .active {
        cursor: pointer;
        background: gray;
    }

    .tabs {
        width: 200px;
        ul,
        li {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            padding: 10px;
        }

        li:hover {
            cursor: pointer;
            background-color: pink;
        }
    }

    .content {
        width: fit-content;
    }

    .active {
        cursor: pointer;
        background: gray;
    }

    .cool {
        border: 10px;
        /* font-size: 20px; */
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
    const navigate = useNavigate();
    const { height, width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<ActiveTabType>('userInfo');
    const [showOldContent, setShowOldContent] = useState(false);
    const appContext = useContext(AppContext);

    const [searchParams, setSearchParams] = useSearchParams();

    // useEffect(() => {
    //     setSearchParams({ tab: 'userInfo' });
    //     appContext.setModal({open: false, content: null})
    // }, []);

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
            appContext.setModal({ open: false, content: null });
        },
    });

    console.log(user);

    if (isLoading) return <Loading />;

    if (error) return <p>Error. User not found</p>;

    return (
        <PageContainer>
            <p>
                Screen width: {width} - Height: {height}
            </p>
            <p>{width < 768 ? 'MOBILE' : 'LAPTOP'} SCREEN</p>
            {/* NEW UI */}
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
                                className={`cool ${
                                    tab.id === searchParams.get('tab') && 'active'
                                } `}
                            >
                                {tab.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* content */}
                <div className="content">
                    {!searchParams.get('tab') ||
                        (searchParams.get('tab') === 'userInfo' && (
                            <div>
                                <h1>User info</h1>
                                <p>Username: {user.username}</p>
                                <p>UserId: {user._id}</p>
                                <p>Email: {user.email}</p>
                                <p>//TODO: change password</p>
                                <input type="text" />
                            </div>
                        ))}

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

            {/* QUICK PRINTOUT -> TODO: DELETE LATER WHEN NEW CONTENT IS READY */}
            <button onClick={() => setShowOldContent(!showOldContent)}>
                {showOldContent ? 'Hide' : 'Show'} old content
            </button>
            {showOldContent && (
                <div>
                    <p>Username: {user.username}</p>
                    <p>UserId: {user._id}</p>
                    <p>Email: {user.email}</p>
                    <h3>Owned campgrounds:</h3>
                    <ol>
                        {user.campgrounds.map((campground: Campground) => (
                            <li key={campground._id}>
                                <Link to={`/campgrounds/${campground._id}`}>
                                    {campground.title} (${campground.price})
                                </Link>
                            </li>
                        ))}
                    </ol>
                    <h3>Favorited campgrounds</h3>
                    <ol>
                        {user.favoritedCampgrounds.map(campground => (
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

                    <h3>Reservations</h3>
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
                                                Nights: {resv.nights} - guests: {resv.guests}
                                            </p>
                                            <p>
                                                totalPrice: {resv.totalPrice} - status:{' '}
                                                {resv.status}
                                            </p>
                                        </div>
                                        <div>
                                            <Link to={`/reservation/${resv._id}/confirm`}>
                                                {resv._id}
                                            </Link>
                                        </div>
                                    </li>
                                );
                            })}
                    </ol>
                </div>
            )}

            <Button onClick={() => navigate(-1)}>Back</Button>
        </PageContainer>
    );
};

export default User;
