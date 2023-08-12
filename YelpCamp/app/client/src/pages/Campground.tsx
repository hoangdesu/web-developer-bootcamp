import React, { useRef, useState, useContext, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import AppContext from '../store/app-context';

import {
    Container,
    Button,
    Card,
    ListGroup,
    Form,
    Col,
    Row,
    Carousel,
    Image,
} from 'react-bootstrap';
import { LocationOn, Sell, Person, Star } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import Review from '../components/Review';
import { Review as ReviewType } from '../types';
import FlashAlert from '../components/FlashAlert';
import { USDtoVND } from '../utils/currency';
import { Box, Rating } from '@mui/material';
import styled from '@emotion/styled';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const ImageThumbnails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 8px;
    gap: 6px;
    /* opacity: 0.8; */

    & > img {
        transition: 0.3s all;
    }

    & > img:hover {
        cursor: pointer;
        opacity: 0.8 !important;
    }
`;

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const reviewText = useRef<HTMLInputElement>(null);

    const [ratingValue, setRatingValue] = useState<number>(3);
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

        // return;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            axios
                .post(
                    `/api/v1/campgrounds/${campground._id}/reviews`,
                    {
                        review: {
                            comment: reviewText.current?.value || '',
                            rating: ratingValue || 1,
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
                    setRatingValue(3);
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        appContext.setAlert({
                            message: 'Unauthorized to add review. Please login again',
                            variant: 'danger',
                        });
                        appContext.setCurrentUser(null);
                        localStorage.removeItem('currentUser');
                        navigate('/login');
                    } else {
                        appContext.setAlert({
                            message: `${err.response.staus} - ${err.response.data}`,
                            variant: 'danger',
                        });
                    }
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
                    // TODO: write a error handling function for navigating
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

    // console.log('reviews:', campground.reviews);

    const averageRating = () => {
        const result = (
            campground?.reviews?.reduce((accumulator, review) => accumulator + review.rating, 0) /
            campground?.reviews?.length
        ).toFixed(1);
        if (result === 'NaN') return '-';
        return result;
    };

    // console.log(campground);

    const changeImageHandler = index => {
        // console.log(index);
        setIndex(index);
    };

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                <FlashAlert />
                <Row>
                    <Col>
                        <Card>
                            {/* {campground.images?.map(image => (
                                <Card.Img variant="top" src={image.url} />
                            ))} */}

                            {/* CAROUSEL */}

                            <Carousel activeIndex={index} onSelect={changeImageHandler}>
                                {campground.images?.map(image => (
                                    <Carousel.Item key={image.url}>
                                        {/* <ExampleCarouselImage text="First slide" /> */}
                                        <Card.Img
                                            variant="top"
                                            src={image.url}
                                            height={'400px'}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        {/* <Image src={image.url} className="img-fluid w-100" height={'300px'} /> */}
                                        {/* <Carousel.Caption>
                                            <h3>First slide label</h3>
                                            <p>
                                                Nulla vitae elit libero, a pharetra augue mollis
                                                interdum.
                                            </p>
                                        </Carousel.Caption> */}
                                    </Carousel.Item>
                                ))}
                            </Carousel>

                            <ImageThumbnails>
                                {campground.images?.map((image, i) => (
                                    <>
                                        {/* <img key={image.url} src={image.url} alt="" width={100} height={60} className="object-fit-fill border rounded" onClick={changeImageHandler} /> */}
                                        <Image
                                            key={image.url}
                                            src={image.url}
                                            alt={image.filename}
                                            width={'100px'}
                                            height={'60px'}
                                            rounded
                                            onClick={() => changeImageHandler(i)}
                                            style={{
                                                opacity: index === i ? 1 : 0.5,
                                                objectFit: 'cover',
                                            }}

                                            // TODO: set selected to full opacity -> DONE
                                            // TODO: refactor this shit
                                            // TODO: limit to only 10 images upload
                                        />
                                    </>
                                ))}
                            </ImageThumbnails>

                            {/* <Card.Img variant="top" src={campground.image} /> */}
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
                                    <Person />{' '}
                                    <Link to={`/users/${campground.author?.username}`}>
                                        {campground.author?.username || 'annonymous'}
                                    </Link>
                                </ListGroup.Item>
                            </ListGroup>
                            {isAuthor() && (
                                <Card.Body>
                                    <Link to={`/campgrounds/${campgroundId}/edit`}>
                                        <Button variant="info">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="danger"
                                        className="mx-2"
                                        onClick={deleteCampgroundHandler}
                                    >
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
                                <h2>Leave a review</h2>
                                <Form
                                    className="mb-5"
                                    noValidate
                                    validated={validated}
                                    onSubmit={onReviewSubmit}
                                >
                                    <Form.Group className="mb-2" controlId="reviewRating">
                                        <Rating
                                            name="simple-controlled"
                                            value={ratingValue}
                                            onChange={(event, newValue) => {
                                                setRatingValue(newValue || 1);
                                            }}
                                            // size="large"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="reviewComment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" ref={reviewText} required />
                                        <Form.Control.Feedback type="invalid">
                                            Please add your comment
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button variant="primary" className="my-3" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </>
                        )}
                        <h2>
                            {campground.reviews?.length || 0}{' '}
                            {campground.reviews?.length === 0 ? 'review' : 'reviews'}
                        </h2>

                        {campground.reviews?.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <p>Average rating: {averageRating()}</p>
                                <Rating
                                    name="read-only"
                                    value={parseFloat(averageRating()) || 1}
                                    readOnly
                                    // size="small"
                                    precision={0.5}
                                    emptyIcon={
                                        <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                                    }
                                />
                            </Box>
                        )}

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
