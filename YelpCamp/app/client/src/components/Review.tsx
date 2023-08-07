import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Card, Form } from 'react-bootstrap';
import { Check, Clear, Edit } from '@mui/icons-material';
import { Review } from '../types';
import AppContext from '../store/app-context';

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
                {/* Only allow review deletion if isAuthor */}
                {appContext.currentUser && isAuthor() && (
                    <span className="icons">
                        {!isEditingReview ? <Edit onClick={editReviewHandler} /> : <Check onClick={editReviewHandler} />}
                        <Clear onClick={removeReviewHandler} />
                    </span>
                )}

                {isEditingReview ? (
                    <>
                        <Form.Control defaultValue={review.rating} />
                        <Form.Control as="textarea" defaultValue={review.comment} />
                    </>
                ) : (
                    <>
                        <Card.Title>User: {review.author?.username}</Card.Title>
                        <Card.Title>Rating: {review.rating}</Card.Title>
                        <Card.Text>Comment: {review.comment} </Card.Text>
                    </>
                )}
            </StyledCardBody>
        </Card>
    );
};

export default Review;
