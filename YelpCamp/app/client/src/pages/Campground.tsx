import React from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container, Button } from '@mui/material';

import Navbar from '../components/Navbar';

import { API_V1 } from '../constants';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();

    const deleteCampgroundHandler = async () => {
        if (confirm(`Delete ${campground.title}?`)) {
            await axios.delete(`${API_V1}/campgrounds/${campgroundId}`);
            alert('Deleted successfully!');
            navigate('/');
        }
    };

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`${API_V1}/campgrounds/${campgroundId}`).then(res => res.data),
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error!</p>;

    return (
        <div>
            <Navbar />
            <Container>
                {campground ? (
                    <>
                        <h1>{campground.title}</h1>
                        <h3>
                            {campground.location} - ${campground.price}
                        </h3>
                        <p>{campground.description}</p>
                    </>
                ) : (
                    <>
                        <p>Error querying campground</p>
                    </>
                )}
                
                <Link to={`/campgrounds/${campgroundId}/edit`}>
                    <Button>Edit</Button>
                </Link>
                
                <Button onClick={deleteCampgroundHandler}>Delete</Button>
            </Container>
        </div>
    );
};

export default Campground;
