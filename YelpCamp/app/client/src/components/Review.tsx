import React, { useContext } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import { Review } from '../types';
import AppContext from '../store/app-context';

interface ReviewProps {
    review: Review;
    refetch: () => {};
}

const StyledCardBody = styled(Card.Body)`
    .clearIcon {
        display: none;
        position: absolute;
        right: 0;
        top: 0px;
        margin: 10px;
        width: 20px;
        height: 20px;
        opacity: 0.8;
    }

    &:hover {
        .clearIcon {
            display: inline;
        }
    }

    .clearIcon:hover {
        cursor: pointer;
    }
`;

const Review: React.FunctionComponent<ReviewProps> = ({ review, refetch }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    // console.log(appContext.alert)

    const removeReviewHandler = () => {
        if (confirm('Are you sure to delete this comment?')) {
            axios
                .delete(`/api/v1/campgrounds/${review.campground}/reviews/${review._id}`)
                .then(res => {
                    appContext.setAlert({
                        message: 'Comment deleted',
                        variant: 'success'
                    });
                    refetch();
                })
                .catch(e => {
                    console.log('Delete failed', e);
                    appContext.setAlert({
                        message: 'Failed to delete comment',
                        variant: 'danger'
                    });
                    appContext.setCurrentUser(null);
                });
        }
    };

    return (
        <Card className="mb-3">
            <StyledCardBody>
                <ClearIcon onClick={removeReviewHandler} className="clearIcon" />
                <Card.Title>Rating: {review.rating}</Card.Title>
                <Card.Text>Comment: {review.comment}</Card.Text>
            </StyledCardBody>
        </Card>
    );
};

export default Review;
