import React from 'react';
import { Card, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

import { Campground } from '../types';
import styled from '@emotion/styled';
import { Place } from '@mui/icons-material';

interface CardProps {
    campground: Campground;
}

const StyledCard = styled(Card)`
    width: 16rem;
    box-shadow: 0 0 8px #f1e0e0;
    transition: 0.2s ease;

    &:hover {
        box-shadow: 1px 1px 10px #d3c4c4;
    }
`;

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground }) => {
    // console.log(campground);
    return (
        // TODO: fix this shit again -> Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
        <StyledCard>
            <Link
                to={`campgrounds/${campground._id}`}
                style={{ textDecoration: 'none', color: '#212529', height: '25em' }}
            >
                <Row>
                    {/* // might not need carousel in homepage */}
                    
                    {/* <Carousel interval={null}>
                        {campground.images?.map(image => (
                            <Carousel.Item key={image.url}>
                                <Card.Img
                                    variant="top"
                                    src={image.url}
                                    height={'200'}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel> */}

                    <Card.Img
                        variant="top"
                        src={campground.images[0].url}
                        height={'200'}
                        style={{ objectFit: 'cover' }}
                    />

                    <Col>
                        <Card.Body>
                            <Card.Title>{campground.title}</Card.Title>
                            <Card.Subtitle>
                                <small className="text-muted">
                                    <Place />
                                    {campground.location}
                                </small>
                            </Card.Subtitle>
                            <Card.Text className="my-3">$ {campground.price}</Card.Text>
                            <Card.Text className="my-3">
                                Created by {campground.author?.username}
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Link>
        </StyledCard>
    );
};

export default CampgroundCard;
