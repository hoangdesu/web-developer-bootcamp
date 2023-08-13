import React from 'react';
import { Card, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Campground } from '../types';
import styled from '@emotion/styled';

interface CardProps {
    campground: Campground;
}

// text-decoration: none;
//     color: #212529;

const StyledCard = styled(Card)`
    width: 18rem;
    height: 100%;
    box-shadow: 0 0 8px #f1e0e0;
    transition: 0.2s ease;

    &:hover {
        box-shadow: 1px 1px 10px #d3c4c4;
    }
`;

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground }) => {
    // console.log(campground);
    return (
        <Link
            to={`campgrounds/${campground._id}`}
            style={{ textDecoration: 'none', color: '#212529' }}
        >
            <StyledCard>
                <Row>
                    <Carousel interval={null}>
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
                    </Carousel>
                    <Col>
                        <Card.Body>
                            <Card.Title>{campground.title}</Card.Title>
                            <Card.Subtitle>
                                <small className="text-muted">{campground.location}</small>
                            </Card.Subtitle>
                            <Card.Text className="my-3">{campground.description}</Card.Text>
                            <Card.Text className="my-3">
                                Username: {campground.author?.username}
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </StyledCard>
        </Link>
    );
};

export default CampgroundCard;
