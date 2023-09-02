import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { Button, Container } from 'react-bootstrap';
import FlashAlert from '../components/FlashAlert';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from './Loading';
import { Campground } from '../types';

export async function loader({ params }) {
    return { username: params.username };
}

const User = () => {
    const { username } = useLoaderData();
    const navigate = useNavigate();

    const {
        isLoading,
        error,
        data: user,
        refetch,
    } = useQuery({
        queryKey: ['userData'],
        queryFn: () => axios.get(`/api/v1/users/username/${username}`).then(res => res.data),
    });

    if (isLoading) return <Loading />;

    if (error) return <p>Error. User not found</p>;

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                {/* <FlashAlert /> */}
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
                <Button onClick={() => navigate(-1)}>Back</Button>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default User;
