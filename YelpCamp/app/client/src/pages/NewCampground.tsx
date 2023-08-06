import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FlashAlert from '../components/FlashAlert';

const NewCampground: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formTitle = useRef<HTMLInputElement>(null);
    const formLocation = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImage = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser) {
            appContext.setAlert({
                message: 'Please log in first',
                variant: 'warning',
            });
            navigate('/login');
        }
    }, [currentUser]);

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
                            price: parseFloat(formPrice.current?.value) || 0,
                            location: formLocation.current?.value || '',
                            image: formImage.current?.value || '',
                            description: formDescription.current?.value || '',
                            author: currentUser?.id,
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    appContext.setAlert({
                        message: 'Created new campground successfully',
                        variant: 'success',
                    });
                    navigate(`/campgrounds/${res.data}`);
                })
                .catch(err => {
                    console.log(err);
                    let errorMessage = 'Something went wrong';
                    if (err.response.status === 400) {
                        errorMessage = err.response?.data?.details ? err.response.data.details[0].message : err.response?.data;
                        // setValidated(false);
                        // form.reset();
                    } else if (err.response.status === 401) {
                        errorMessage = err.response?.data || 'Unauthorized! Please log in again';
                        localStorage.removeItem('currentUser');
                        navigate('/login');
                    } else if (err.response.status === 500) {
                        errorMessage = err.response?.data || err.reponse?.message;
                    }
                    appContext.setAlert({
                        message: errorMessage,
                        variant: 'danger',
                    });
                    appContext.setCurrentUser(null);
                });
        }
        setValidated(true);
    };

    // if (isLoading) return <Loading />;

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-6 offset-3 mt-5">
                <FlashAlert />
                <h1 className="text-center mb-4">New Campground</h1>
                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" ref={formTitle} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Title is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" ref={formLocation} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Location is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="inlineFormInputGroup">Price</Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control type="number" step="0.1" min="0" id="inlineFormInputGroup" defaultValue={0.0} ref={formPrice} required />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Price is required!</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Image Url</Form.Label>
                        <Form.Control type="text" ref={formImage} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Image URL is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" ref={formDescription} />
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
