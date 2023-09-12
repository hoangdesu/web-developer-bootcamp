import React from 'react';
import { Card, Row, Col, Image, Button, Carousel } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

import { Campground } from '../types';
import styled from '@emotion/styled';
import { averageRating } from '../helpers/campground';

interface CardProps {
    campground: Campground;
}

const StyledCard = styled('div')`
    // can use styled(Card)
    position: relative;
    /* box-shadow: 0 0 8px #f1e0e0; */
    /* transition: 0.2s ease;

    /* &:hover {
        box-shadow: 0px 1px 10px #e0d6d6;
    } */
`;

const CampgroundCard: React.FunctionComponent<CardProps> = ({ campground }) => {
    return (
        <StyledCard>
            <Link
                to={`campgrounds/${campground._id}`}
                style={{ textDecoration: 'none', color: '#212529', height: '25em' }}
            >
                <Row>
                    {/* // might not need carousel in homepage */}
                    {/* // TODO: fix this shit again -> Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>. */}

                    {/* <Carousel interval={null}>
                        {campground.images.map((image, index) => (
                            <Carousel.Item key={`${image.url}-${index}}`}>
                                <Card.Img
                                    variant="top"
                                    src={image.url}
                                    height={'200'}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel> */}

                    {/* <Card.Img
                        variant="top"
                        src={campground?.images?.[0]?.url}
                        height={'250px'}
                        style={{ objectFit: 'cover' }}
                    />

                    <Col>
                        <Card.Body>
                            <Card.Title>{campground.title}</Card.Title>
                            <Card.Subtitle>
                                <small className="text-muted">{campground.location}</small>
                            </Card.Subtitle>
                            <Card.Text className="my-3">$ {campground.price}</Card.Text>
                            <Card.Text className="my-3">
                                Hosted by {campground.author?.username}
                            </Card.Text>
                        </Card.Body>
                    </Col> */}

                    <Col>
                        <Card.Img
                            variant="top"
                            src={campground?.images?.[0]?.url}
                            height={'250px'}
                            style={{
                                objectFit: 'cover',
                                borderRadius: '6px',
                            }}
                        />
                        <Card.Body className="flex flex-column gap-1">
                            <div className="flex flex-row justify-between items-baseline mt-2 gap-3">
                                <Card.Title className="font-normal">{campground.title}</Card.Title>
                                <span className="min-w-fit text-sm">
                                    ★ {averageRating(campground)}
                                </span>
                            </div>
                            <Card.Subtitle>
                                <small className="text-muted font-normal">
                                    {campground.location}
                                </small>
                            </Card.Subtitle>
                            <div className="mb-4">
                                <span className="font-semibold">${campground.price}</span>
                                <span> night</span>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Link>
        </StyledCard>
    );
};

export default CampgroundCard;
