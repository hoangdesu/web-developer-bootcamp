import React, { useRef, useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { API_V1 } from '../constants';

import { Container, Button, Card, ListGroup, Form } from 'react-bootstrap';
import { LocationOn, Sell } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();

    const reviewText = useRef<HTMLInputElement>(null);
    const reviewRating = useRef<HTMLInputElement>(null);
    const [ratingValue, setRatingValue] = useState(3);

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`${API_V1}/campgrounds/${campgroundId}`).then(res => res.data),
    });

    const onRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRatingValue(parseInt(e.target.value));
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        axios
            .post(
                `/api/v1/campgrounds/${campground._id}/reviews`,
                {
                    review: {
                        text: reviewText.current?.value || '',
                        rating: reviewRating.current?.value || 0,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then(res => {
                console.log(`OK ${res.data}`);
                // navigate(`/campgrounds/${res.data}`);
            })
            .catch(err => {
                console.log('-- bad request:', err);
                navigate('/error');
            });
    };

    const deleteCampgroundHandler = async () => {
        if (confirm(`Delete ${campground.title}?`)) {
            await axios.delete(`${API_V1}/campgrounds/${campgroundId}`);
            alert('Deleted successfully!');
            navigate('/');
        }
    };

    if (isLoading) return <Loading />;

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

                <h1>Leave a review</h1>

                <Form className="mb-5" noValidate validated={false} onSubmit={onFormSubmit}>
                    <Form.Group className="mb-2" controlId="reviewRating">
                        <Form.Label>Rating: {ratingValue}</Form.Label>
                        <Form.Range name="review[rating]" ref={reviewRating} required onChange={onRangeInputChange} min={0} max={5} />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Review text is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reviewText">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" name="review[text]" ref={reviewText} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Comment is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" className="my-3" type="submit">
                        Submit
                    </Button>
                </Form>

                <h1>All reviews</h1>
                {campground.reviews && (
                    <>
                        <p>Total: {campground.reviews.length} reviews</p>
                        <ul>
                            {campground.reviews.map((review, index) => (
                                <li key={index}>
                                    {review.text} - {review.rating}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default Campground;
