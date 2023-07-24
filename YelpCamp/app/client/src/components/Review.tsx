import React from 'react';
import { Card } from 'react-bootstrap';

interface ReviewProps {
    review: {
        comment: string;
        rating: number;
    };
}

const Review: React.FunctionComponent<ReviewProps> = ({ review }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Rating: {review.rating}</Card.Title>
                <Card.Text>Comment: {review.comment}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Review;
