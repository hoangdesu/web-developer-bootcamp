import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Card, Form } from 'react-bootstrap';
import { Check, Clear, Edit } from '@mui/icons-material';
import { Review } from '../types';
import AppContext from '../store/app-context';
import { Rating } from '@mui/material';

interface ReviewProps {
    review: Review;
    refetch: () => {};
}

const StyledCardBody = styled(Card.Body)`
    .icons {
        display: none;
        position: absolute;
        right: 30px;
        top: 0;
        margin: 10px;
        width: 20px;
        height: 20px;
        opacity: 0.7;
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

const Review: React.FunctionComponent<ReviewProps> = ({ review, refetch }) => {
    const [isEditingReview, setIsEditingReview] = useState(false);
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

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
                    console.log('Delete failed', e);
                    appContext.setAlert({
                        message: 'Failed to delete comment',
                        variant: 'danger',
                    });
                    // appContext.setCurrentUser(null);
                });
        }
    };

    const editReviewHandler = () => {
        setIsEditingReview(!isEditingReview);
    };

    const isAuthor = () => {
        return review.author.username.toString() === appContext.currentUser.username.toString();
    };

    return (
        <Card className="mb-3">
            <StyledCardBody>
                {/* Only allow to edit and delete a review if isAuthor */}
                {appContext.currentUser && isAuthor() && (
                    <span className="icons">
                        {/* TODO: STYLE EDIT REVIEW */}
                        {isEditingReview ? (
                            <>
                                <Check onClick={editReviewHandler} />
                                <p>save</p>
                                <p>cancel</p>
                                <Clear onClick={removeReviewHandler} />
                            </>
                        ) : (
                            <>
                                <Edit onClick={editReviewHandler} />
                                <Clear onClick={removeReviewHandler} />
                            </>
                        )}
                    </span>
                )}

                {/* TODO: EDIT REVIEW HANDLER */}
                {isEditingReview ? (
                    <>
                        <Rating
                            name="simple-controlled"
                            value={review.rating}
                            onChange={(event, newValue) => {
                                // setValue(newValue);
                            }}
                        />
                        <Form.Control as="textarea" defaultValue={review.comment} />
                    </>
                ) : (
                    <>
                        <Card.Title>{review.author?.username}</Card.Title>
                        {/* <Card.Title>Rating: {review.rating}</Card.Title> */}
                        <Rating name="read-only" value={review.rating} readOnly size="small" />
                        <Card.Text>{review.comment}</Card.Text>
                    </>
                )}
            </StyledCardBody>
        </Card>
    );
};

export default Review;
