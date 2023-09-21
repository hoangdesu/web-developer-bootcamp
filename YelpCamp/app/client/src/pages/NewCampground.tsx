import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup, Spinner, Image } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FlashAlert from '../components/FlashAlert';

const NewCampground: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formTitle = useRef<HTMLInputElement>(null);
    const formLocation = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImages = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    useEffect(() => {
        document.title = 'YelpCamp | New Campground';
        if (!currentUser) {
            appContext.setAlert({
                message: 'Please log in first',
                variant: 'warning',
            });
            navigate('/login');
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formImages?.current?.files.length > 10) {
            alert('Please only select maximum 10 images');
            return;
        }

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsUploading(!isUploading);
            const formData = new FormData();
            formData.append('campground[title]', formTitle.current?.value || '');
            formData.append('campground[price]', parseFloat(formPrice.current?.value) || 0);
            formData.append('campground[location]', formLocation.current?.value || '');
            formData.append('campground[description]', formDescription.current?.value || '');
            Array.from(formImages.current?.files).forEach(file => {
                formData.append('campground[images]', file);
            });
            axios
                .post('/api/v1/campgrounds', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: currentUser?.id,
                    },
                })
                .then(res => {
                    appContext.setAlert({
                        message: 'Created new campground successfully',
                        variant: 'success',
                    });
                    navigate(`/campgrounds/${res.data}`);
                })
                .catch(err => {
                    console.error(err);
                    let errorMessage = 'Something went wrong';
                    if (err.response.status === 400) {
                        errorMessage = err.response?.data?.details
                            ? err.response.data.details[0].message
                            : err.response?.data;
                        // setValidated(false);
                        // form.reset();
                    } else if (err.response.status === 401) {
                        errorMessage = err.response?.data || 'Unauthorized! Please log in again';
                        localStorage.removeItem('currentUser');
                        navigate('/login');
                    } else if (err.response.status === 500) {
                        errorMessage =
                            err.response?.data ||
                            err.reponse?.message ||
                            'Server error. Your campground was not created';
                        appContext.setAlert({
                            message: errorMessage,
                            variant: 'danger',
                        });
                        setValidated(false);
                        form.reset();
                        setIsUploading(false);
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

    const onSelectImagesHandler = evt => {
        const imageFiles = Array.from(evt.target.files).map(f => f);
        setSelectedImages(imageFiles);
    };

    return (
        <PageContainer>
            <h1 className="text-center mb-4">New Campground</h1>
            <Form
                className="mb-5"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
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
                    <Form.Control.Feedback type="invalid">
                        Location is required!
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="inlineFormInputGroup">Price</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            step="0.1"
                            min="0"
                            id="inlineFormInputGroup"
                            defaultValue={0.0}
                            ref={formPrice}
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Price is required!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="campgroundDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" ref={formDescription} />
                    <Form.Control.Feedback type="valid">
                        Description is optional
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="campgroundImages" className="mb-3">
                    <Form.Label>Upload images (max 10)</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        ref={formImages}
                        accept="image/*"
                        onChange={onSelectImagesHandler}
                    />
                    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                        Please select some images
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="campgroundImages" className="mb-3">
                    {selectedImages &&
                        selectedImages.map(img => (
                            <Image
                                key={img}
                                src={URL.createObjectURL(img)}
                                style={{
                                    width: '160px',
                                    height: '100px',
                                    marginRight: '8px',
                                    marginBottom: '8px',
                                    objectFit: 'cover',
                                }}
                                alt="thumbnail"
                                thumbnail
                            />
                        ))}
                </Form.Group>

                {isUploading ? (
                    <>
                        <Button variant="secondary" type="submit" disabled>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                as="span"
                            />
                            <span> Creating campground...</span>
                        </Button>
                    </>
                ) : (
                    <Button variant="success" type="submit">
                        Create campground
                    </Button>
                )}
            </Form>
        </PageContainer>
    );
};

export default NewCampground;
