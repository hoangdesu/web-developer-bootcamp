import React from 'react';

import { Container, Form, Button, Col, InputGroup } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

const NewCampground: React.FunctionComponent = () => {
    return (
        <PageContainer>
            <Navbar />

            <Container className="col-6 offset-3 mt-5">
                <h1 className="text-center mb-4">New Campground</h1>
                <Form action="/api/v1/campgrounds" method="post">
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="campground[title]" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="campground[location]" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundPrice">
                        <Form.Label htmlFor="inlineFormInputGroup">Price</Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control type="number" step="0.1" id="inlineFormInputGroup" defaultValue={0.0} name="campground[price]" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Image Url</Form.Label>
                        <Form.Control type="text" name="campground[image]" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="campground[description]" />
                    </Form.Group>

                    <Button variant="success" type="submit">
                        Add campground
                    </Button>
                </Form>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default NewCampground;
