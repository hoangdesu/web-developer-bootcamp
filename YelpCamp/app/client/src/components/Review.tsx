import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { Card, Form } from 'react-bootstrap';
import { Check, Clear, Delete, MoreHoriz } from '@mui/icons-material';
import { Review } from '../types';
import AppContext from '../store/app-context';
import { Rating } from '@mui/material';

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
            return <small className="text-muted">(Edited)</small>;
        }
    };

    return (
        <Card className="mb-3">
            <StyledCardBody>
                {/* Only allow to edit and delete a review if isAuthor */}
                {appContext.currentUser && isAuthor() && (
                    <span className="icons">
                        {isEditingReview ? (
                            <>
                                <Check onClick={saveChangeReviewHandler} />
                                <Clear onClick={() => setIsEditingReview(!isEditingReview)} />
                                <Delete onClick={removeReviewHandler} />
                            </>
                        ) : (
                            <MoreHoriz onClick={() => setIsEditingReview(!isEditingReview)} />
                        )}
                    </span>
                )}

                {isEditingReview ? (
                    <>
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
                            <Card.Title>
                                <StyledLink to={`/users/${review.author?.username}`}>
                                    {review.author?.username}
                                </StyledLink>
                            </Card.Title>
                            {/* TODO: parse date this shit */}
                            <span>{review.updatedAt}</span>
                        </div>
                        <Rating name="read-only" value={review.rating} readOnly size="small" />
                        <Card.Text>
                            {review.comment} {isEdited()}
                        </Card.Text>
                    </>
                )}
            </StyledCardBody>
        </Card>
    );
};

export default Review;
