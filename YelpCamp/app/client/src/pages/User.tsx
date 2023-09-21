import React, { useContext, useEffect, useRef, useState } from 'react';
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
    /* .active {
        cursor: pointer;
        background: gray;
    } */
    position: relative;

    .tabs {
        /* width: 200px; */
        /* position: absolute; */
        z-index: 1;

        ul,
        li {
            list-style: none;
            padding: 0;
            margin: 0;
            height: auto;
	width: auto;
        }

        li {
            padding: 10px;
            /* z-index: 100; */
            /* display: inline-block; */
            /* background: transparent; */
            position: static;
        }

        /* li:hover {
            cursor: pointer;
            background-color: pink;
        } */
    }

    .content {
        width: fit-content;
    }

    .active {
        cursor: pointer;
        background: gray !important;
    }

    .cool {
        border: 10px;
        /* font-size: 20px; */
    }

    .overlay {
        position: absolute;
        /*   for test */
        /* 	height: 10px;
	width: 100px; */
        /*  for test  */
        background-color: aquamarine;
        z-index: -1;
        /* transition: 0.3s ease left, width, opacity; */
        transition: 0.3s ease all;
        opacity: 0;
    }

    .overlay.active {
        /* z-index: -1; */

        opacity: 1;
        background: red;
    }

    .testing-box {
        /* width: 400px; */
        height: 700px;
        background: pink;
        position: fixed;
        z-index: -2;
        top: 150px;
        left: 150px;
        /* w-[100px] h-[100px] bg-red-400 fixed -z-2 top-[200px] left-[200px] */
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

    const overlayRef = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     console.dir(overlayRef);
    // }, [overlayRef]);

    const printoverlayRef = () => {
        console.dir(overlayRef.current.getBoundingClientRect());
    };

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

    const mouseEnterHandler = e => {
        console.log('mouse enter: ', e.currentTarget.getBoundingClientRect());
        const position = e.currentTarget.getBoundingClientRect();
        if (overlayRef.current) {
            overlayRef.current.classList.add('active');
            overlayRef.current.style.left = position.x -200 + 'px';
            overlayRef.current.style.top = position.y - 200 + 'px';
            overlayRef.current.style.height = position.height + 'px';
            overlayRef.current.style.width = position.width + 'px';
            // overlayRef.current.style.background = 'blue';
            // overlayRef.current.style.opacity = '1';

        }
    };

    const mouseLeaveHandler = e => {
        console.log('mouse leave:', e.currentTarget.getBoundingClientRect());
        const position = e.currentTarget.getBoundingClientRect();
        // overlayRef.current.style.background = 'pink';
        // overlayRef.current.style.opacity = 0;
        if (overlayRef.current) {
        overlayRef.current.classList.remove('active');
        }

    };

    return (
        <PageContainer>
            <p>
                Screen width: {width} - Height: {height}
            </p>

            <button onClick={printoverlayRef}>Box ref</button>
            <p>{width < 768 ? 'MOBILE' : 'LAPTOP'} SCREEN</p>
            {/* NEW UI */}
            <Container className="flex flex-row tab">
                {/* tab */}
                <div className="tabs">
                    <div ref={overlayRef} className="overlay">
                        {/* {searchParams.get('tab')} */}
                    </div>

                    <div className="testing-box">TESTING</div>
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
                                onMouseEnter={mouseEnterHandler}
                                onMouseLeave={mouseLeaveHandler}
                            >
                                <p>{tab.title}</p>
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


// tutorial:
// https://codepen.io/hoangdesu/pen/poqpLKP
// https://www.youtube.com/watch?v=rHdfxfuC_8U&ab_channel=WEBCIFAR