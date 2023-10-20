import React, { useEffect, useRef, useState, useContext } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQueries } from 'react-query';
import axios from '../../config/yelpcampAxios';

import AppContext from '../../store/app-context';

import { Container, Button, Form, Col, Row } from 'react-bootstrap';
import { Star, Favorite, FavoriteBorder, IosShare } from '@mui/icons-material';

import PageContainer from '../../components/PageContainer';
import Loading from '../Loading';
import Review from './Review';
import { Review as ReviewType } from '../../types';
import { Alert, Box, Modal, Rating, Snackbar } from '@mui/material';
import CampgroundCardCarousel from './CampgroundCardCarousel';
import CampgroundMap from './CampgroundMap';
import { Campground } from '../../types';
import { averageRating } from '../../helpers/campground';
import styled from '@emotion/styled';
import PrimaryBlackButton from '../../components/Buttons/PrimaryBlackButton';
import CampgroundReservation from './CampgroundReservation';
import CampgroundHostedBySection from './CampgroundHostedBySection';
import PageModal from '../../components/Modals/PageModal';
import ModalShare from '../../components/Modals/ModalShare';
import ModalLogin from '../../components/Modals/ModalLogin';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const StyledSection = styled.section`
    padding: 20px 0;
    border-top: 1px solid rgba(54, 46, 46, 0.1);
`;

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData() as { campgroundId: string };
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const reviewText = useRef<HTMLInputElement>(null);

    const [ratingValue, setRatingValue] = useState<number>(3);
    const [validated, setValidated] = useState<boolean>(false);

    const [campground, setCampground] = useState<Campground | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        appContext.setModal({ open: false, content: null, requiresLoggedIn: false });
    }, []);

    const [campgroundQuery, favoritedCampgroundsQuery] = useQueries([
        {
            queryKey: ['campgroundData'],
            queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data),
            onSuccess: (data: Campground) => {
                document.title = `YelpCamp | ${data.title}`;
                setCampground(data); // setting campground specifically to ensure new data
            },
            onError: err => {
                appContext.setAlert({
                    message: 'Invalid campground!',
                    variant: 'warning',
                });
                navigate('/');
            },
        },
        {
            queryKey: ['favoritedCampgrounds'],
            queryFn: () =>
                axios
                    .get(
                        `/api/v1/users/${appContext.currentUser.id.toString()}/favorited-campgrounds`,
                    )
                    .then(res => res.data),
            enabled: !!appContext.currentUser,
            onSuccess: data => {
                data.forEach(favCamp => {
                    if (favCamp._id === campgroundId) setIsFavorited(true);
                });
            },
        },
    ]);

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
                            Authorization: appContext.currentUser?.id.toString(),
                        },
                    },
                )
                .then(res => {
                    appContext.setAlert({
                        message: 'Thank you for your review!',
                        variant: 'info',
                    });
                    campgroundQuery.refetch();
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

    const toggleFavoriteCampground = evt => {
        if (!appContext.currentUser) {
            appContext.setModal({ open: true, content: <ModalLogin />, requiresLoggedIn: true });
            return;
        }

        axios
            .post(
                `/api/v1/users/${appContext.currentUser.id.toString()}/favorite-campground`,
                { campgroundId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: appContext.currentUser.id.toString(),
                    },
                },
            )
            .then(res => {
                setIsFavorited(res.data.isFavorited);
                appContext.setSnackbar(
                    true,
                    res.data.isFavorited ? (
                        <>
                            <span>Saved to your favorite. </span>
                            <Link
                                to={`/user/${appContext.currentUser?.username}?tab=favorite`}
                                className="text-inherit"
                                target="_blank"
                            >
                                View all
                            </Link>
                        </>
                    ) : (
                        <span>Removed from your favorite.</span>
                    ),
                    'success',
                );
            })
            .catch(err => {
                appContext.setSnackbar(
                    true,
                    'Error: Failed adding campground to your favorite',
                    'error',
                );
            });
    };

    if (campgroundQuery.isLoading || !campground) return <Loading />;

    if (campgroundQuery.isError) {
        appContext.setAlert({
            message: 'Invalid campground!',
            variant: 'info',
        });
        navigate('/');
    }

    return (
        <PageContainer>
            <Row className="mb-3 mt-0">
                <Col>
                    <h1 className="font-normal">{campground.title}</h1>
                    <div className="flex flex-row items-center justify-between gap-3">
                        <span>
                            <span>★ {averageRating(campground)}</span>
                            {campground.reviews?.length > 0 && (
                                <span>
                                    {' · '}
                                    {campground.reviews?.length}{' '}
                                    {campground.reviews?.length > 1 ? 'reviews' : 'review'}
                                </span>
                            )}
                            <span>
                                {' · '}
                                <a
                                    href={`https://www.google.com/search?q=${campground.location}`}
                                    style={{ color: 'inherit' }}
                                    target="_blank"
                                >
                                    {campground.location}
                                </a>
                            </span>
                        </span>

                        <span className="flex flex-row items-center">
                            <span
                                className="hover:cursor-pointer rounded p-2 hover:bg-neutral-100 active:bg-neutral-200 flex flex-row items-center"
                                onClick={toggleFavoriteCampground}
                            >
                                <span className="text-red-500 mr-1">
                                    {isFavorited ? <Favorite /> : <FavoriteBorder />}{' '}
                                </span>
                                <span className="mb-[-8px]">Save</span>
                            </span>

                            <span
                                className="hover:cursor-pointer rounded p-2 hover:bg-neutral-100 active:bg-neutral-200 flex flex-row items-center"
                                onClick={() => {
                                    appContext.setModal({
                                        open: true,
                                        content: <ModalShare />,
                                    });
                                }}
                            >
                                <span className="text-gray-800 mr-1">
                                    <IosShare />
                                </span>
                                <span className="mb-[-8px]">Share</span>
                            </span>
                        </span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={7}>
                    <CampgroundCardCarousel campground={campground} />

                    <StyledSection>
                        <CampgroundHostedBySection campground={campground} />
                    </StyledSection>

                    <StyledSection>
                        <h4 className="font-normal">About</h4>
                        <p>{campground.description}</p>
                    </StyledSection>

                    <StyledSection>
                        <h4 className="font-normal">Location</h4>
                        <a
                            href={`https://www.google.com/search?q=${campground.location}`}
                            style={{ color: 'inherit' }}
                            target="_blank"
                        >
                            {campground.location}
                        </a>
                    </StyledSection>

                    <StyledSection>
                        <h4 className="font-normal">Reservation</h4>
                        <CampgroundReservation campground={campground} />
                    </StyledSection>
                </Col>

                <Col lg={5}>
                    {/* using react-map-gl */}
                    {campground && <CampgroundMap campground={campground} />}

                    {/* only activate review form for logged in user */}

                    {appContext.currentUser && (
                        <Form
                            className="mt-5 flex flex-column mb-[-2rem]"
                            noValidate
                            validated={validated}
                            onSubmit={onReviewSubmit}
                        >
                            <h3 className="font-normal">Leave a review</h3>
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
                                <Form.Control.Feedback type="invalid">
                                    Please add your comment
                                </Form.Control.Feedback>
                            </Form.Group>
                            <PrimaryBlackButton className="mt-1 bg-red-400 self-end">
                                Submit
                            </PrimaryBlackButton>
                        </Form>
                    )}

                    <h4 className="font-normal mt-5">Reviews</h4>
                    {campground.reviews?.length > 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'base-line',
                                justifyContent: 'space-between',
                            }}
                        >
                            <p>
                                {campground.reviews?.length || 0}{' '}
                                {campground.reviews?.length > 1 ? 'reviews' : 'review'} · Average
                                rating: {averageRating(campground)}
                            </p>
                            <Rating
                                name="read-only"
                                value={parseFloat(averageRating(campground)) || 1}
                                readOnly
                                precision={0.5}
                                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                        </Box>
                    )}

                    {campground.reviews && (
                        <>
                            {campground.reviews?.length === 0 && (
                                <span
                                    className="hover:underline hover:cursor-pointer text-emerald-800"
                                    onClick={() => {
                                        reviewText.current?.focus();
                                    }}
                                >
                                    Add your first review!
                                </span>
                            )}
                            <div className="h-[600px] overflow-y-auto">
                                {campground.reviews.map((review: ReviewType) => (
                                    <Review
                                        key={review._id}
                                        review={review}
                                        refetch={campgroundQuery.refetch}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            {/* <Snackbar
                open={true}
                autoHideDuration={6000}
                //   onClose={}
                message="Note archived"
                //   action={action}
            ><Alert severity="success">This is a success message!</Alert></Snackbar> */}
        </PageContainer>
    );
};

export default Campground;
