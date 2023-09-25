import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { Card, Form, OverlayTrigger, Popover, PopoverHeader } from 'react-bootstrap';
import { Check, Clear, Delete, MoreHoriz } from '@mui/icons-material';
import { Review } from '../../types';
import AppContext from '../../store/app-context';
import { Rating, Tooltip } from '@mui/material';
import { formatDate, timeDifference } from '../../helpers/campground';

interface ReviewProps {
    review: Review;
    refetch: () => {};
}

const StyledCardBody = styled(Card.Body)`
    .icons {
        float: right;
        display: none;
        opacity: 0.8;
    }

    &:hover {
        .icons {
            display: flex;
        }
    }

    .icons:hover {
        cursor: pointer;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #42434f;
    &:hover {
        text-decoration: underline;
    }
`;

const Review: React.FunctionComponent<ReviewProps> = ({ review, refetch }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const [isEditingReview, setIsEditingReview] = useState(false);
    const [formData, setFormData] = useState({
        comment: review.comment,
        rating: review.rating,
    });

    const removeReviewHandler = () => {
        // TODO: REPLACE with modal and snackbar

        const btnonclick = () => {
            axios
                .delete(`/api/v1/campgrounds/${review.campground}/reviews/${review._id}`, {
                    headers: {
                        Authorization: appContext.currentUser.id.toString(),
                    },
                })
                .then(res => {
                    appContext.setAlert({
                        message: 'Comment deleted',
                        variant: 'success',
                    });
                    refetch();
                })
                .catch(e => {
                    // console.log('Delete failed', e);
                    appContext.setAlert({
                        message: 'Failed to delete comment',
                        variant: 'danger',
                    });
                });
        };

        appContext.setModal({
            open: true,
            content: (
                <div>
                    Delete comment?
                    <button onClick={btnonclick}>Yes</button>
                </div>
            ),
        });

        return;

        if (confirm('Are you sure to delete this comment?')) {
            axios
                .delete(`/api/v1/campgrounds/${review.campground}/reviews/${review._id}`, {
                    headers: {
                        Authorization: appContext.currentUser.id.toString(),
                    },
                })
                .then(res => {
                    appContext.setAlert({
                        message: 'Comment deleted',
                        variant: 'success',
                    });
                    refetch();
                })
                .catch(e => {
                    // console.log('Delete failed', e);
                    appContext.setAlert({
                        message: 'Failed to delete comment',
                        variant: 'danger',
                    });
                });
        }
    };

    const saveChangeReviewHandler = () => {
        if (formData.comment.length === 0) {
            return;
        }

        const btnonclick = () => {
            axios
                .put(
                    `/api/v1/campgrounds/${review.campground}/reviews/${review._id}`,
                    {
                        review: {
                            comment: formData.comment,
                            rating: formData.rating,
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
                    setIsEditingReview(!isEditingReview);
                    refetch();
                })
                .catch(err => {
                    console.log('error', err);
                    if (err.response.status === 401) {
                        appContext.setAlert({
                            message: 'Please login again!',
                            variant: 'info',
                        });
                        localStorage.removeItem('currentUser');
                        navigate('/login');
                    } else {
                        appContext.setAlert({
                            message: 'Something went wrong. Your review was not saved',
                            variant: 'danger',
                        });
                        setIsEditingReview(!isEditingReview);
                    }
                });
        };

        // TODO: REPLACE with modal

        appContext.setModal({
            open: true,
            content: (
                <div>
                    Save comment?
                    <button onClick={btnonclick}>save</button>
                </div>
            ),
        });

        return;

        if (confirm('Save review?')) {
            axios
                .put(
                    `/api/v1/campgrounds/${review.campground}/reviews/${review._id}`,
                    {
                        review: {
                            comment: formData.comment,
                            rating: formData.rating,
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
                    setIsEditingReview(!isEditingReview);
                    refetch();
                })
                .catch(err => {
                    console.log('error', err);
                    if (err.response.status === 401) {
                        appContext.setAlert({
                            message: 'Please login again!',
                            variant: 'info',
                        });
                        localStorage.removeItem('currentUser');
                        navigate('/login');
                    } else {
                        appContext.setAlert({
                            message: 'Something went wrong. Your review was not saved',
                            variant: 'danger',
                        });
                        setIsEditingReview(!isEditingReview);
                    }
                });
        }
    };

    const isAuthor = () => {
        return review.author.username.toString() === appContext.currentUser.username.toString();
    };

    const isEdited = () => {
        if (review.createdAt !== review.updatedAt) {
            return 'edited';
        }
    };

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h6">Review by {review.author.username}</Popover.Header>
            <Popover.Body>
                <div>
                    <u>Created at:</u> {formatDate(review.createdAt)}
                </div>
                <div>
                    <u>Updated at:</u> {formatDate(review.updatedAt)}
                </div>
                <div>
                    <u>Last updated:</u> {timeDifference(Date.now(), Date.parse(review.updatedAt))}
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <Card className="mb-3">
            <StyledCardBody>
                {/* Only allow to edit and delete a review if isAuthor */}
                {appContext.currentUser && isAuthor() && (
                    <span className="icons">
                        {isEditingReview ? (
                            <>
                                <Tooltip title="Save review" placement="top" enterDelay={300}>
                                    <Check onClick={saveChangeReviewHandler} />
                                </Tooltip>
                                <Tooltip title="Cancel" placement="top" enterDelay={300}>
                                    <Clear onClick={() => setIsEditingReview(!isEditingReview)} />
                                </Tooltip>
                                <Tooltip title="Delete review" placement="top" enterDelay={300}>
                                    <Delete onClick={removeReviewHandler} />
                                </Tooltip>
                            </>
                        ) : (
                            <MoreHoriz onClick={() => setIsEditingReview(!isEditingReview)} />
                        )}
                    </span>
                )}

                {isEditingReview ? (
                    <>
                        <Card.Title className="font-normal">{review.author?.username}</Card.Title>
                        <Rating
                            name="simple-controlled"
                            value={formData.rating}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({ ...prev, rating: newValue || 1 }));
                            }}
                        />
                        <Form.Control
                            as="textarea"
                            value={formData.comment}
                            onChange={evt => {
                                const comment = evt.currentTarget?.value;
                                setFormData(prev => ({
                                    ...prev,
                                    comment,
                                }));
                            }}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex flex-row justify-between">
                            <Card.Title className="font-normal">
                                <StyledLink to={`/user/${review.author?.username}`}>
                                    {review.author?.username}
                                </StyledLink>
                            </Card.Title>
                            <span></span>
                        </div>
                        <div className="flex flex-row gap-2 items-end text-muted text-sm mb-2">
                            <Rating
                                name="read-only"
                                value={review.rating}
                                readOnly
                                size="small"
                                className="bottom-[2px]"
                            />
                            <span>{' · '}</span>
                            <OverlayTrigger placement="top" overlay={popover}>
                                <span className="hover:underline">
                                    {timeDifference(Date.now(), Date.parse(review.updatedAt))}
                                </span>
                            </OverlayTrigger>
                            {isEdited() && (
                                <>
                                    <span>{' · '}</span>
                                    <span>{isEdited()}</span>
                                </>
                            )}
                        </div>
                        <Card.Text>{review.comment}</Card.Text>
                    </>
                )}
            </StyledCardBody>
        </Card>
    );
};

export default Review;
