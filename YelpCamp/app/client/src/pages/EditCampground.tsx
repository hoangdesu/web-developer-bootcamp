import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container, Button, Form, InputGroup, Image } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
import Loading from './Loading';

import { API_V1 } from '../constants';
import AppContext from '../store/app-context';
import FlashAlert from '../components/FlashAlert';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const EditCampground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData();
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const [validated, setValidated] = useState(false);

    const formTitle = useRef<HTMLInputElement>(null);
    const formLocation = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImage = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);
    //

    // TODO: protect route when user is not logged in / unauthorized to edit
    // useEffect(() => {
    //     if (!currentUser) navigate('/login');
    // }, [])

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data),
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios
                .put(
                    `/api/v1/campgrounds/${campground._id}`,
                    {
                        campground: {
                            title: formTitle.current?.value || '',
                            price: parseFloat(formPrice.current?.value) || 0,
                            location: formLocation.current?.value || '',
                            image: formImage.current?.value || '',
                            description: formDescription.current?.value || '',
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: currentUser.id,
                        },
                    },
                )
                .then(res => {
                    appContext.setAlert({
                        message: 'Campground has been updated',
                        variant: 'success',
                    });
                    navigate(`/campgrounds/${campground._id}`);
                })
                .catch(err => {
                    appContext.setAlert({
                        message: `${err.response.status} - ${err.response.data}`,
                        variant: 'danger',
                    });
                    // console.error(err);

                    if (err.response.status === 401) navigate('/login');
                    // appContext.setCurrentUser(null);
                    // navigate('/login');
                });
        }
        setValidated(true);
    };

    if (isLoading) return <Loading />;

    if (error) return <p>Error</p>;

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-6 offset-3 my-5">
                <FlashAlert />
                <h1 className="text-center mb-4">Edit Campground</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            ref={formTitle}
                            defaultValue={campground.title}
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Title is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundLocation">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            ref={formLocation}
                            defaultValue={campground.location}
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Location is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundPrice">
                        <Form.Label>Price</Form.Label>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                step="0.5"
                                defaultValue={campground.price}
                                ref={formPrice}
                                required
                            />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Price is required!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    {/* <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Image Url</Form.Label>
                        <Form.Control type="text" ref={formImage} defaultValue={campground.image} required />
                        <Image src={campground.image} thumbnail className="mt-2" />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Image URL is required!</Form.Control.Feedback>
                    </Form.Group> */}

                    {/* IMAGES */}
                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Images Url</Form.Label>
                        <div>
                            {campground.images.map(image => (
                                <Image src={image.url.replace('upload/', 'upload/w_200/')} width={200} thumbnail />
                            ))}
                        </div>
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Image URL is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="campgroundDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            ref={formDescription}
                            defaultValue={campground.description}
                        />
                        <Form.Control.Feedback type="valid">
                            Description is optional
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="success" type="submit">
                        Update campground
                    </Button>

                    <Link to={-1}>
                        <Button variant="secondary" type="submit" className="mx-2">
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
