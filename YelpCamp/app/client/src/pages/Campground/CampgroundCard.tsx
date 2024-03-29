import React from 'react';
import { Card, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

import { Campground } from '../../types';
import styled from '@emotion/styled';
import { averageRating } from '../../helpers/campground';
import FallbackImage from '../../assets/logo.png';

interface CardProps {
    campground: Campground;
}

const StyledCard = styled('div')`
    /* PC view */
    position: relative;
    width: 100%;

    .img {
        transition: all 0.15s ease;
        object-fit: cover;
        border-radius: 8px;

        /* Mobile view */
        @media (max-width: 640px) {
            height: 250px;
        }
    }

    &:hover .img {
        box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;
        border-radius: 0;
    }

    /* Mobile view */
    @media (max-width: 768px) {
        max-width: none;
    }
`;

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground }) => {
    return (
        <StyledCard>
            <Link
                to={`/campgrounds/${campground._id}`}
                style={{ textDecoration: 'none', color: '#212529', height: '25em' }}
            >
                <Card.Img
                    variant="top"
                    src={campground?.images?.[0]?.url}
                    height={'200px'}
                    className="img"
                    draggable={false}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = FallbackImage;
                    }}
                />

                <Card.Body className="flex flex-column gap-1">
                    <div className="flex flex-row justify-between items-baseline mt-2 gap-3">
                        <Card.Title className="font-normal">{campground.title}</Card.Title>
                        <span className="min-w-fit text-sm">★ {averageRating(campground)}</span>
                    </div>
                    <Card.Subtitle>
                        <small className="text-muted font-normal">{campground.location}</small>
                    </Card.Subtitle>
                    <div className="mb-3">
                        <span className="font-semibold">${campground.price}</span>
                        <span> night</span>
                    </div>
                </Card.Body>
            </Link>
        </StyledCard>
    );
};

export default CampgroundCard;
