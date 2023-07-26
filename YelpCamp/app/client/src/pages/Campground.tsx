import React, { useRef, useState, useContext } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { API_V1 } from '../constants';
import AppContext from '../store/app-context';

import { Container, Button, Card, ListGroup, Form, Col, Row, Alert } from 'react-bootstrap';
import { LocationOn, Sell } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import Review from '../components/Review';
import FlashMessage from '../components/FlashMessage';
import { Review as ReviewType } from '../types';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    // console.log(appContext.alert);

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
        queryFn: () => axios.get(`${API_V1}/campgrounds/${campgroundId}`).then(res => res.data),
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
                        },
                    },
                )
                .then(res => {
                    appContext.setAlert('Thank you for your review!');
                    refetch();
                    form.reset();
                    setValidated(false); // reset the form validated state
                })
                .catch(err => {
                    console.log('-- bad request:', err);
                    navigate('/error');
                });
        }
        setValidated(true);
    };

    const deleteCampgroundHandler = () => {
        if (confirm(`Delete ${campground.title}?`)) {
            axios.delete(`${API_V1}/campgrounds/${campgroundId}`).then(() => {
                appContext.setAlert('Deleted campground successfully');
                navigate('/');
            });
        }
    };

    if (isLoading) return <Loading />;

    if (error || !campground) {
        appContext.setAlert('Invalid campground!');
        navigate('/');
    }

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                {appContext.alert && (
                    <FlashMessage duration={3 * 1000} persistOnHover={true}>
                        <Alert variant="info" onClose={() => appContext.setAlert(null)} dismissible>
                            <span>{appContext.alert}</span>
                        </Alert>
                    </FlashMessage>
                )}
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
                    </Col>

                    <Col xs={5} lg={5}>
                        <h1>Leave a review</h1>

                        <Form className="mb-5" noValidate validated={validated} onSubmit={onReviewSubmit}>
                            <Form.Group className="mb-2" controlId="reviewRating">
                                <Form.Label>{`Rating: ${ratingValue}`}</Form.Label>
                                <Form.Range ref={reviewRating} onChange={() => setRatingValue(parseInt(e.target.value))} min={1} max={5} step={1} />
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

                        <h2>
                            {campground.reviews?.length || 0} {campground.reviews?.length === 0 ? 'review' : 'reviews'}
                        </h2>
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
