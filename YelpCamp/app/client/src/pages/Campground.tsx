import React from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { API_V1 } from '../constants';

import { Container, Button, Card, ListGroup, Form, InputGroup } from 'react-bootstrap';
import { LocationOn, Sell } from '@mui/icons-material';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();

    const deleteCampgroundHandler = async () => {
        if (confirm(`Delete ${campground.title}?`)) {
            await axios.delete(`${API_V1}/campgrounds/${campgroundId}`);
            alert('Deleted successfully!');
            navigate('/');
        }
    };

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`${API_V1}/campgrounds/${campgroundId}`).then(res => res.data),
    });

    if (isLoading) return <Loading />;

    // if (error || !campground) return <p>Error! {}</p>;
    if (error || !campground) {
        throw new Error('Invalid campground !!!');
    }

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-7 my-5">
                <Card>
                    <Card.Img variant="top" src={campground.image} />
                    <Card.Body>
                        <Card.Title>{campground.title}</Card.Title>
                        <Card.Text>{campground.description}</Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item className="text-muted">
                            <LocationOn /> {campground.location}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Sell /> ${campground.price}
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Link to={`/campgrounds/${campgroundId}/edit`}>
                            <Button variant="info">Edit</Button>
                        </Link>
                        <Button variant="danger" className="mx-2" onClick={deleteCampgroundHandler}>
                            Delete
                        </Button>
                    </Card.Body>
                </Card>

                <Link to="/">
                    <Button variant="secondary" className="my-3">
                        Back
                    </Button>
                </Link>

                {/* <Form className="mb-5" noValidate validated={false} onSubmit={() => {}}>
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="campground[title]" ref={null} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Title is required!</Form.Control.Feedback>
                    </Form.Group>
                </Form> */}

                <form action={`/api/v1/campgrounds/${campground._id}/reviews`} method="POST">
                    <div>
                        <label htmlFor="">Review</label>
                        <textarea name="review[text]"></textarea>
                    </div>

                    <div>
                        <label htmlFor="">Rating</label>
                        <input type="number" name="review[rating]" />
                    </div>

                    <button>Submit</button>
                </form>

                <h1>All reviews </h1>
                {campground.reviews && (
                    <>
                        <p>Total: {campground.reviews.length} reviews</p>
                        <ul>
                            {campground.reviews.map((review, index) => (
                                <li key={index}>
                                    {review.text} - {review.rating}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default Campground;
