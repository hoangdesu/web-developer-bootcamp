import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import axios from '../../config/yelpcampAxios';
import { Link, useNavigate } from 'react-router-dom';

import { Card, Form, OverlayTrigger, Popover, PopoverHeader } from 'react-bootstrap';
import { Check, Clear, Delete, MoreHoriz } from '@mui/icons-material';
import { Review } from '../../types';
import AppContext from '../../store/app-context';
import { Rating, Tooltip } from '@mui/material';
import { formatDate, timeDifference } from '../../helpers/campground';
import ModalDeleteReview from '../../components/Modals/ModalDeleteReview';
import ModalSaveReviewChange from '../../components/Modals/ModalSaveReviewChange';

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
        appContext.setModal({
            open: true,
            content: <ModalDeleteReview review={review} refetch={refetch} />,
        });
    };

    const saveChangeReviewHandler = () => {
        if (formData.comment.length === 0) {
            return;
        }
        appContext.setModal({
            open: true,
            content: (
                <ModalSaveReviewChange
                    review={review}
                    refetch={refetch}
                    formData={formData}
                    isEditingReview={isEditingReview}
                    setIsEditingReview={setIsEditingReview}
                />
            ),
        });
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
