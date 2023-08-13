import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container, Button, Form, InputGroup, Image, Spinner } from 'react-bootstrap';

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
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const formTitle = useRef<HTMLInputElement>(null);
    const formLocation = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImages = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);
    //

    // TODO: protect route when user is not logged in / unauthorized to edit
    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [])

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
            const formData = new FormData();
            formData.append('campground[title]', formTitle.current?.value || '');
            formData.append('campground[price]', parseFloat(formPrice.current?.value) || 0);
            formData.append('campground[location]', formLocation.current?.value || '');
            formData.append('campground[description]', formDescription.current?.value || '');
            Array.from(formImages.current?.files).forEach(file => {
                formData.append('campground[images]', file);
            });

            axios
                .put(`/api/v1/campgrounds/${campground._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: currentUser?.id,
                    },
                })
                .then(res => {
                    appContext.setAlert({
                        message: 'Campground has been updated',
                        variant: 'success',
                    });
                    navigate(`/campgrounds/${campground._id}`);
                })
                .catch(err => {
                    console.error(err);
                    appContext.setAlert({
                        message: `${err.response.status} - ${err.response.data}`,
                        variant: 'danger',
                    });

                    if (err.response.status === 401) navigate('/login');
                    // appContext.setCurrentUser(null);
                    // navigate('/login');

                    setIsUpdating(false);
                });
        }
        setValidated(true);
    };

    if (isLoading) return <Loading />;

    if (error) return <p>Error</p>;

    const onSelectImagesHandler = evt => {
        const imageFiles = Array.from(evt.target.files).map(f => f);
        setSelectedImages(imageFiles);
    };

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

                    {/* IMAGES */}
                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Images uploaded ({campground.images.length})</Form.Label>
                        <div>
                            {campground.images.map(image => (
                                <Image
                                    key={image.url}
                                    src={image.url.replace('upload/', 'upload/w_200/')}
                                    style={{
                                        width: '160px',
                                        height: '100px',
                                        marginRight: '8px',
                                        marginBottom: '8px',
                                        objectFit: 'cover',
                                    }}
                                    alt="Thumbnail"
                                    thumbnail
                                />
                            ))}
                        </div>
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Image URL is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="campgroundImages" className="mb-3">
                        <Form.Label>Add more images</Form.Label>
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
                                    alt="Thumbnail"
                                    thumbnail
                                />
                            ))}
                    </Form.Group>

                    {isUpdating ? (
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
                            Update campground
                        </Button>
                    )}

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
