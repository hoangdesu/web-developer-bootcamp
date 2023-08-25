import React, { useEffect, useRef, useState, useContext } from 'react';
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
    Popover,
    OverlayTrigger,
    Image,
} from 'react-bootstrap';
import { LocationOn, Sell, Person, Star, Event } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import Review from '../components/Review';
import { Review as ReviewType } from '../types';
import FlashAlert from '../components/FlashAlert';
import { Box, Rating } from '@mui/material';
import CampgroundCardCarousel from '../components/CampgroundCardCarousel';
import CampgroundMap from '../components/CampgroundMap';
import { Campground } from '../types';
import {
    isAuthor,
    formatDate,
    timeDifference,
    formattedPrice,
    averageRating,
} from '../helpers/campground';
import styled from '@emotion/styled';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const StyledSection = styled.section`
    /* margin-top: 20px; */
    padding: 20px 0;
    border-bottom: 1px solid rgba(54, 46, 46, 0.1);
`;

const ReserveSection = styled.div`
    background: white;
    box-shadow: 0px 1px 5px 5px #d8e7e4; // find better values
    border: 1px solid pink;
    border-radius: 8px;
    padding: 12px;
    width: fit-content;
`;

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const reviewText = useRef<HTMLInputElement>(null);

    const [ratingValue, setRatingValue] = useState<number>(3);
    const [validated, setValidated] = useState<boolean>(false);

    const [campground, setCampground] = useState<Campground | null>(null);

    const { isLoading, error, isError, data, refetch } = useQuery({
        queryKey: ['campgroundData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data),
        onSuccess: data => {
            setCampground(data); // setting campground specifically to ensure new data
        },
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

    if (isLoading || !campground) return <Loading />;

    if (isError) {
        appContext.setAlert({
            message: 'Invalid campground!',
            variant: 'info',
        });
        navigate('/');
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h4">Created at</Popover.Header>
            <Popover.Body>{formatDate(campground.createdAt)}</Popover.Body>
        </Popover>
    );

    const v1 = (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-4">
                <FlashAlert />
                <Row className="mb-3">
                    <Col>
                        <section className="my-2">
                            <h1 className="font-bold">{campground.title}</h1>
                            <div className="flex flex-row justify-between">
                                <span>
                                    ★ {averageRating(campground)} · {campground.reviews.length}{' '}
                                    reviews · {campground.location}
                                </span>
                                {/* show buttons to edit and delete campground for author */}
                                {isAuthor(appContext, campground) ? (
                                    <div>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </div>
                                ) : (
                                    <span className="">Save Share</span>
                                )}
                            </div>
                        </section>
                    </Col>
                </Row>

                <Row>
                    <Col lg={7}>
                        <CampgroundCardCarousel campground={campground} />

                        <StyledSection>
                            <h3>
                                Campground hosted by{' '}
                                <Link
                                    to={`/users/${campground.author?.username}`}
                                    className="text-primary-dark-color"
                                >
                                    {campground.author?.username || 'annonymous'}
                                </Link>
                            </h3>
                        </StyledSection>

                        <StyledSection>
                            <h3>About</h3>
                            <p>{campground.description}</p>
                        </StyledSection>

                        <StyledSection>
                            <h3>Location</h3>
                            <p>{campground.location}</p>
                        </StyledSection>

                        <StyledSection>
                            <h3>Price</h3>
                            <p>${campground.price} night</p>
                        </StyledSection>

                        <StyledSection>
                            // TODO: RESERVE SECTION
                            <ReserveSection>
                                <div>$10 night</div>
                                <div>2 reviews</div>
                                <div>
                                    Check in <input type="date" name="" id="" />
                                    Check out <input type="date" name="" id="" />
                                </div>
                                <section>
                                    <p>$480 x 5 nights ---- $2400</p>
                                    <p>Service fee -------- $59</p>
                                </section>

                                <section>
                                    <p>Total -------------- $2459</p>
                                </section>

                                <button
                                        className="my-3 bg-primary-dark-color text-primary-color transition ease-in-out outline-0 px-5 py-2 border-0 hover:text-white hover:bg-black duration-300"
                                
                                >RESERVE →</button>
                            </ReserveSection>
                        </StyledSection>

                        <Card>
                            {/* <CampgroundCardCarousel campground={campground} />

                            <Card.Body>
                                <Card.Title>{campground.title}</Card.Title>
                                <h2 className="font-bold">{campground.title}</h2>
                                <Card.Text>{campground.description}</Card.Text>
                            </Card.Body> */}


                                {/* can consider using the card component */}
<div>$10 night</div>
                                <div>2 reviews</div>
                                <div>
                                    Check in <input type="date" name="" id="" />
                                    Check out <input type="date" name="" id="" />
                                </div>
                                <section>
                                    <p>$480 x 5 nights ---- $2400</p>
                                    <p>Service fee -------- $59</p>
                                </section>

                                <section>
                                    <p>Total -------------- $2459</p>
                                </section>

                                <button
                                        className="my-3 bg-primary-dark-color text-primary-color transition ease-in-out outline-0 px-5 py-2 border-0 hover:text-white hover:bg-black duration-300 place-self-end"
                                
                                >RESERVE →</button>


                            <ListGroup className="list-group-flush">
                                <ListGroup.Item className="text-muted">
                                    <LocationOn /> {campground.location}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Sell /> {formattedPrice(campground.price)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Person />{' '}
                                    <Link to={`/users/${campground.author?.username}`}>
                                        {campground.author?.username || 'annonymous'}
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item className="text-muted">
                                    <Event />
                                    <OverlayTrigger placement="top" overlay={popover}>
                                        <span>
                                            {timeDifference(
                                                Date.now(),
                                                Date.parse(campground.createdAt),
                                            )}
                                        </span>
                                    </OverlayTrigger>
                                </ListGroup.Item>
                            </ListGroup>

                            {isAuthor(appContext, campground) && (
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
                            <button variant="secondary" className="my-3">
                                Back
                            </button>
                        </Link>
                    </Col>

                    <Col lg={5}>
                        {/* {mapViewState && <Map viewState={mapViewState} />} */}
                        {/* using react-map-gl */}
                        {campground && <CampgroundMap campground={campground} />}

                        {/* only activate review form for logged in user */}
                        {appContext.currentUser ? (
                            <>
                                <Form
                                    className="my-3 flex flex-column"
                                    noValidate
                                    validated={validated}
                                    onSubmit={onReviewSubmit}
                                >
                                    <h2>Leave a review</h2>
                                    <Form.Group className="mb-2" controlId="reviewRating">
                                        <Rating
                                            name="simple-controlled"
                                            value={ratingValue}
                                            onChange={(event, newValue) => {
                                                setRatingValue(newValue || 1);
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="reviewComment">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" ref={reviewText} required />
                                        {/* TODO: style this motherfucker */}
                                        {/* <div> */}
                                        {/* <input type="textarea" ref={reviewText} required /> */}
                                        {/* </div> */}
                                        <Form.Control.Feedback type="invalid">
                                            Please add your comment
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <button
                                        className="my-3 bg-primary-dark-color text-primary-color transition ease-in-out outline-0 px-5 py-2 border-0 hover:text-white hover:bg-black duration-300 place-self-end"
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </Form>
                            </>
                        ) : (
                            <Link to="/login">Login to add your review</Link>
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
                                <p>Average rating: {averageRating(campground)}</p>
                                <Rating
                                    name="read-only"
                                    value={parseFloat(averageRating(campground)) || 1}
                                    readOnly
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
            {/* </div> */}
            <Footer />
        </PageContainer>
    );

    return <>{v1}</>;
};

export default Campground;
