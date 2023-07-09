import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Container, Form, Button, InputGroup } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

const NewCampground: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();

    const formTitle = useRef<HTMLInputElement>(null);
    const formLocation = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImage = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios
                .post(
                    '/api/v1/campgrounds',
                    {
                        campground: {
                            title: formTitle.current?.value || '',
                            price: formPrice.current?.value || 0,
                            location: formLocation.current?.value || '',
                            image: formImage.current?.value || '',
                            description: formDescription.current?.value || '',
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    if (res.status === 200) {
                        console.log(`navigating to: /campgrounds/${res.data._id}`);
                        navigate(`/campgrounds/${res.data}`);
                    }
                })
                .catch(err => err);
        }
        setValidated(true);
    };

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-6 offset-3 mt-5">
                <h1 className="text-center mb-4">New Campground</h1>
                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="campground[title]" ref={formTitle} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Title is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" name="campground[location]" ref={formLocation} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Location is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="inlineFormInputGroup">Price</Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                step="0.1"
                                id="inlineFormInputGroup"
                                defaultValue={0.0}
                                name="campground[price]"
                                ref={formPrice}
                                required
                            />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Price is required!</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Image Url</Form.Label>
                        <Form.Control type="text" name="campground[image]" ref={formImage} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Image URL is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="campground[description]" ref={formDescription} />
                        <Form.Control.Feedback type="valid">Description is optional</Form.Control.Feedback>
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
