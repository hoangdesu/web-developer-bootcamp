import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup, Spinner, Image } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FlashAlert from '../components/FlashAlert';
import ArtImage from '../assets/new-campground-art.jpg';
import styled from '@emotion/styled';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    background-color: white;
    box-sizing: border-box;
    border-radius: 8px;

    margin-bottom: 50px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 16px;

    .form-container {
        width: 60%;
    }

    .form {
        padding: clamp(1rem, 3rem, 3rem);
    }

    .art-container {
        width: 40%;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)),
            url(${ArtImage});
        background-size: cover;
        background-position: 50%;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .thumbnails-container {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    @media (max-width: 1024px) {
        .form-container {
            width: 100%;
        }
        .art-container {
            display: none;
        }
    }
`;

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
            // appContext.setAlert({
            //     message: 'Please log in first',
            //     variant: 'warning',
            // });

            appContext.setSnackbar(true, 'You need to login first', 'warning');
            navigate('/login');
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formImages?.current?.files.length > 10) {
            alert('Please only select maximum 10 images');
            return;
        }

        if (formImages?.current?.files.length < 1) {
            alert('Please select at least 1 image');
            return;
        }

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsUploading(true);
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
                    const errorMessage = err.response?.data || 'Error: Failed to create campground';
                    appContext.setSnackbar(true, errorMessage, 'error');
                    setIsUploading(false);
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
            <h1 className="text-center">New Campground</h1>
            <p className="text-center text-muted mt-2 mb-5">
                List your campground on YelpCamp - for FREE!
            </p>
            <Wrapper>
                <div className="form-container">
                    <Form
                        className="form"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <Form.Group className="mb-3" controlId="campgroundTitle">
                            <Form.Label>Campground Title</Form.Label>
                            <Form.Control type="text" ref={formTitle} required />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Title is required!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="campgroundLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" ref={formLocation} required />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Location is required!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div>--- Map location preview...</div>

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
                                <Form.Control.Feedback type="valid">
                                    Looks good!
                                </Form.Control.Feedback>
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

                        <Form.Group
                            controlId="campgroundImages"
                            className="mb-3 thumbnails-container"
                        >
                            {selectedImages &&
                                selectedImages.map(img => (
                                    <Image
                                        key={img}
                                        src={URL.createObjectURL(img)}
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            objectFit: 'cover',
                                        }}
                                        alt="thumbnail"
                                        thumbnail
                                    />
                                ))}
                        </Form.Group>

                        {isUploading ? (
                            <PrimaryBlackButton className="mt-3 w-full" disabled>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    as="span"
                                />
                                <span className="ml-3">Creating campground...</span>
                            </PrimaryBlackButton>
                        ) : (
                            <PrimaryBlackButton className="mt-3 w-full">
                                Create campground
                            </PrimaryBlackButton>
                        )}
                    </Form>
                </div>
                <div className="art-container"></div>
            </Wrapper>
        </PageContainer>
    );
};

export default NewCampground;
