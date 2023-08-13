import React from 'react';
import { Card, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Campground } from '../types';

interface CardProps {
    campground: Campground;
}

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground }) => {
    // console.log(campground);
    return (
        <Card
        // style={{backgroundColor: 'red'}}
        >
            <Row>
                <Col md={4}>
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
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{campground.title}</Card.Title>
                        <Card.Subtitle>
                            <small className="text-muted">{campground.location}</small>
                        </Card.Subtitle>
                        <Card.Text className="my-3">{campground.description}</Card.Text>
                        <Card.Text className="my-3">
                            Username: {campground.author?.username}
                        </Card.Text>

                        <Link to={`campgrounds/${campground._id}`}>
                            <Button variant="primary" className="mt-2">
                                View this campground
                            </Button>
                        </Link>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default CampgroundCard;
