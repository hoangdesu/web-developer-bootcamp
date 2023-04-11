import React from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { API_V1 } from '../constants';
import PageContainer from '../components/PageContainer';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
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
        <PageContainer>
            <Navbar />

            <Container>
                <div>
                    {campground ? (
                        <>
                            <h1>{campground.title}</h1>
                            <h3>
                                {campground.location} - ${campground.price}
                            </h3>
                            <p>{campground.description}</p>
                            <img src={campground.image} alt="" width={700} />
                        </>
                    ) : (
                        <p>Error querying campground</p>
                    )}
                </div>

                <Link to={`/campgrounds/${campgroundId}/edit`}>
                    <Button>Edit</Button>
                </Link>

                <Button onClick={deleteCampgroundHandler}>Delete</Button>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default Campground;
