import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container, Button, Form, InputGroup } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

import { API_V1 } from '../constants';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const EditCampground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`${API_V1}/campgrounds/${campgroundId}`).then(res => res.data),
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error</p>;

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-6 offset-3 my-5">
                <h1 className="text-center mb-4">Edit Campground</h1>
                <Form action={`/api/v1/campgrounds/${campground._id}?_method=PUT`} method="post">
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="campground[title]" defaultValue={campground.title} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="campground[location]" defaultValue={campground.location} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundPrice">
                        <Form.Label htmlFor="inlineFormInputGroup">Price</Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                step="0.1"
                                id="inlineFormInputGroup"
                                name="campground[price]"
                                defaultValue={campground.price}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Image Url</Form.Label>
                        <Form.Control type="text" name="campground[image]" defaultValue={campground.image} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="campground[description]" defaultValue={campground.description} />
                    </Form.Group>

                    <Button variant="success" type="submit">
                        Update campground
                    </Button>

                    <Link to={-1}>
                        <Button variant="info" type="submit">
                            Cancel
                        </Button>
                    </Link>
                </Form>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default EditCampground;
