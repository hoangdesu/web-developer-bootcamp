import React from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { API_V1 } from '../constants';

import { Container, Button, Card, ListGroup, Col, Row } from 'react-bootstrap';
import { LocationOn, Sell } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

    // if (error || !campground) return <p>Error! {}</p>;
    if (error || !campground) {
        throw new Error('Invalid campground !!!');
    }

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-7 my-5">
                <Card>
                    <Card.Img variant="top" src={campground.image} />
                    <Card.Body>
                        <Card.Title>{campground.title}</Card.Title>
                        <Card.Text>{campground.description}</Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item className="text-muted">
                            <LocationOn /> {campground.location}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Sell /> ${campground.price}
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Link to={`/campgrounds/${campgroundId}/edit`}>
                            <Button variant="info">Edit</Button>
                        </Link>
                        <Button variant="danger" className="mx-2" onClick={deleteCampgroundHandler}>
                            Delete
                        </Button>
                    </Card.Body>
                </Card>

                <Link to="/">
                    <Button variant="secondary" className="my-3">
                        Back
                    </Button>
                </Link>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default Campground;
