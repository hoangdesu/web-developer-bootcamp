import React, { useRef, useState, useContext, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Button, Card, ListGroup, Form, Col, Row } from 'react-bootstrap';
import { LocationOn, Sell, Person } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import Review from '../components/Review';
import { Review as ReviewType } from '../types';
import FlashAlert from '../components/FlashAlert';
import { USDtoVND } from '../utils/currency';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const reviewText = useRef<HTMLInputElement>(null);
    const reviewRating = useRef<HTMLInputElement>(null);

    const [ratingValue, setRatingValue] = useState<Number>(3);
    const [validated, setValidated] = useState<boolean>(false);

    const {
        isLoading,
        error,
        data: campground,
        refetch,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data),
    });

    const onReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            axios
                .post(
                    `/api/v1/campgrounds/${campground._id}/reviews`,
                    {
                        review: {
                            comment: reviewText.current?.value || '',
                            rating: reviewRating.current?.value || 0,
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: appContext.currentUser.id.toString(),
                        },
                    },
                )
                .then(res => {
                    appContext.setAlert({
                        message: 'Thank you for your review!',
                        variant: 'info',
                    });
                    refetch();
                    form.reset();
                    setValidated(false); // reset the form validated state
                })
                .catch(err => {
                    appContext.setAlert({
                        message: 'Unauthorized to delete comment. Please login again',
                        variant: 'danger',
                    });
                    appContext.setCurrentUser(null);
                    navigate('/login');
                });
        }
        setValidated(true);
    };

    const deleteCampgroundHandler = () => {
        if (confirm(`Delete ${campground.title}?`)) {
            axios
                .delete(`/api/v1/campgrounds/${campgroundId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: appContext.currentUser.id.toString(),
                    },
                })
                .then(() => {
                    appContext.setAlert({
                        message: 'Deleted campground successfully',
                        variant: 'warning',
                    });
                    navigate('/');
                })
                .catch(err => {
                    console.error(err);
                    let message = '';
                    if (err.response.status === 401) {
                        message = 'Unauthorized to delete campground. Please log in again.';
                        appContext.setAlert({
                            message,
                            variant: 'danger',
                        });
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        message = 'Unauthorized to delete campground';
                    } else {
                        message = `${err.response.status} - ${err.response.data}`;
                    }
                    appContext.setAlert({
                        message,
                        variant: 'danger',
                    });
                    // appContext.setCurrentUser(null);
                });
        }
    };

    if (isLoading) return <Loading />;

    if (error || !campground) {
        appContext.setAlert({
            message: 'Invalid campground!',
            variant: 'info',
        });
        navigate('/');
    }

    const formattedPrice = `$${campground.price}/night (~${USDtoVND(campground.price)})`;

    const isAuthor = () => {
        if (appContext.currentUser) return campground.author?._id === appContext.currentUser.id;
        return false;
    };

    console.log('reviews:', campground.reviews);

    const averageRating = () => {
        const result = (campground?.reviews?.reduce((accumulator, review) => accumulator + review.rating, 0) / campground?.reviews?.length).toFixed(
            1,
        );
        if (result === 'NaN') return '-';
        return result;
    };

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                <FlashAlert />
                <Row>
                    <Col>
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
                                    <Sell /> {formattedPrice}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Person /> <Link to={`/users/${campground.author?.username}`}>{campground.author?.username || 'annonymous'}</Link>
                                </ListGroup.Item>
                            </ListGroup>
                            {isAuthor() && (
                                <Card.Body>
                                    <Link to={`/campgrounds/${campgroundId}/edit`}>
                                        <Button variant="info">Edit</Button>
                                    </Link>
                                    <Button variant="danger" className="mx-2" onClick={deleteCampgroundHandler}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            )}
                        </Card>

                        <Link to="/">
                            <Button variant="secondary" className="my-3">
                                Back
                            </Button>
                        </Link>
                    </Col>

                    <Col lg={5}>
                        {/* only activate review form for logged in user */}
                        {appContext.currentUser && (
                            <>
                                <h1>Leave a review</h1>
                                <Form className="mb-5" noValidate validated={validated} onSubmit={onReviewSubmit}>
                                    <Form.Group className="mb-2" controlId="reviewRating">
                                        <Form.Label>{`Rating: ${ratingValue}`}</Form.Label>
                                        <Form.Range
                                            ref={reviewRating}
                                            onChange={evt => setRatingValue(parseInt(evt.target.value))}
                                            min={1}
                                            max={5}
                                            step={1}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="reviewComment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" ref={reviewText} required />
                                        <Form.Control.Feedback type="invalid">Please add your comment</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button variant="primary" className="my-3" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </>
                        )}
                        <h2>
                            {campground.reviews?.length || 0} {campground.reviews?.length === 0 ? 'review' : 'reviews'}
                        </h2>
                        <p>Average rating: {averageRating()}</p>
                        {campground.reviews && (
                            <>
                                {campground.reviews?.length === 0 && 'Add your first review!'}
                                {campground.reviews.map((review: ReviewType) => (
                                    <Review key={review._id} review={review} refetch={refetch} />
                                ))}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default Campground;
