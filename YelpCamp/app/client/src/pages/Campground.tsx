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

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const reviewText = useRef<HTMLInputElement>(null);
    const reviewRating = useRef<HTMLInputElement>(null);

    const [ratingValue, setRatingValue] = useState<Number>(3);
    const [validated, setValidated] = useState<boolean>(false);

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
                    console.log(`OK ${res.data}`);
                    navigate(0); // reload
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
                alert('Deleted successfully!');
                navigate('/');
            });
        }
    };

    if (isLoading) return <Loading />;

    if (error || !campground) {
        throw new Error('Invalid campground !!!');
    }

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                <FlashMessage duration={3 * 1000} persistOnHover={true}>
                    {appContext.alert && (
                        <Alert variant="info" onClose={() => appContext.setAlert(null)} dismissible>
                            <span>{appContext.alert}</span>
                        </Alert>
                    )}
                </FlashMessage>
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

                        <Form className="mb-5" noValidate validated={validated} onSubmit={onFormSubmit}>
                            <Form.Group className="mb-2" controlId="reviewRating">
                                <Form.Label>{`Rating: ${ratingValue}`}</Form.Label>
                                <Form.Range ref={reviewRating} onChange={onRangeInputChange} min={1} max={5} step={1} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="reviewComment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" ref={reviewText} required />
                                <Form.Control.Feedback type="valid">Thank you for your review!</Form.Control.Feedback>
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
                                {campground.reviews.map(review => (
                                    <Review key={review._id} review={review} />
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
