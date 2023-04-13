import React from 'react';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Campground } from '../types';

interface CardProps {
    campground: Campground;
}

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground: cg }) => {
    return (
        <Card>
            <Row>
                <Col md={4}>
                    <Image fluid src={cg.image} alt="Campground image" />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{cg.title}</Card.Title>
                        <Card.Subtitle>
                            <small className="text-muted">{cg.location}</small>
                        </Card.Subtitle>
                        <Card.Text className="my-3">{cg.description}</Card.Text>

                        <Link to={`campgrounds/${cg._id}`}>
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
