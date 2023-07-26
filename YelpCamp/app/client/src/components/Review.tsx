import React, { useContext } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import { Review } from '../types';
import AppContext from '../store/app-context';
import { useMutation } from 'react-query';

interface ReviewProps {
    review: Review;
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

const Review: React.FunctionComponent<ReviewProps> = ({ review }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    // console.log(appContext.alert)
    
    const removeReviewHandler = () => {
        if (confirm('Are you sure to delete this comment?')) {
            axios
                // TODO: consider refactor to useMutation to hot reload reviews array
                .delete(`/api/v1/campgrounds/${review.campground}/reviews/${review._id}`)
                .then(res => {
                    navigate(0);
                    appContext.setAlert('Comment deleted');

                })
                .catch(e => {
                    console.log('Delete failed', e);
                    navigate(0);
                    appContext.setAlert('Failed to delete comment');
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
