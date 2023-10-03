import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container, Button, Form, InputGroup, Image, Spinner } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';
import Loading from './Loading';
import PageModal from '../components/Modals/PageModal';

import AppContext from '../store/app-context';
import FlashAlert from '../components/FlashAlert';
import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import EditPreviewMap from '../components/EditPreviewMap';
import { Campground } from '../types';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const UploadedImagesWrapper = styled.span`
    display: inline-block;

    position: relative;
    & > input {
        position: absolute;
        right: 12px;
        top: 6px;
    }
`;

// {
//     display: flex;
//     flex-direction: row;
//     /* background-color: white; */
//     /* box-sizing: border-box;
//     border-radius: 8px;

//     margin-bottom: 50px;
//     box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 16px; */

//     .column1 {
//         width: 50%;
//         padding: 2rem;
//     }

//     .form {
//         padding: clamp(1rem, 3rem, 3rem);
//     }

//     .column2 {
//         width: 50%;
//         padding: 2rem;

//         /* background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
//         background-size: cover;
//         background-position: 50%;
//         border-top-right-radius: 8px;
//         border-bottom-right-radius: 8px; */
//     }

//     .thumbnails-container {
//         display: grid;
//         grid-gap: 12px;
//         grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
//     }

//     @media (max-width: 1024px) {
//         flex-direction: column;
//         .column1 {
//             width: 100%;
//         }
//         .column2 {
//             width: 100%;
//         }
//     }
// }
const Wrapper = styled.div`
    margin: auto;
    max-width: 600px;

    .thumbnails-container {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }
`;

const EditCampground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData() as { campgroundId: string };
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const [validated, setValidated] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const [formLocation, setFormLocation] = useState('');

    const mapRef = useRef(null)
    const formTitle = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImages = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const [showDeleteCheckboxes, setShowDeleteCheckboxes] = useState(false);
    const [deletingImages, setDeletingImages] = useState<String[]>([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    // protect route when user is not logged in
    useEffect(() => {
        document.title = 'YelpCamp | Edit Campground';
        if (!currentUser) navigate('/login');
    }, []);

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data),
        onSuccess: (campground: Campground) => {
            setFormLocation(campground.location);
        },
    });

    // protect route when user is unauthorized to edit
    useEffect(() => {
        if (campground) {
            if (campground.author) {
                if (campground.author._id !== currentUser.id) {
                    appContext.setAlert({
                        message: "You don't have permission to edit this campground!",
                        variant: 'warning',
                    });
                    navigate('/');
                }
            }
        }
    }, [campground]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append('campground[title]', formTitle.current?.value || '');
            formData.append('campground[price]', parseFloat(formPrice.current?.value) || 0);
            formData.append('campground[location]', formLocation);
            formData.append('campground[description]', formDescription.current?.value || '');
            Array.from(formImages.current?.files).forEach(file => {
                formData.append('campground[images]', file);
            });

            deletingImages.forEach(img => formData.append('deletingImages[]', img));

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

    // TODO: handle delete campground in modal
    const deleteCampgroundHandler = () => {
        appContext.setModal({
            open: true,
            content: <p>Confirm Delete campground</p>,
        });

        return;

        if (confirm(`Delete ${campground.title}?`)) {
            axios
                .delete(`/api/v1/campgrounds/${campgroundId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: appContext.currentUser.id.toString(),
                    },
                })
                .then(() => {
                    appContext.setAlert({
                        message: 'Deleted campground successfully',
                        variant: 'warning',
                    });
                    navigate('/');
                })
                .catch(err => {
                    // TODO: write a error handling function for navigating
                    console.error(err);
                    let message = '';
                    if (err.response.status === 401) {
                        message = 'Unauthorized to delete campground. Please log in again.';
                        appContext.setAlert({
                            message,
                            variant: 'danger',
                        });
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        message = 'Unauthorized to delete campground';
                    } else {
                        message = `${err.response.status} - ${err.response.data}`;
                    }
                    appContext.setAlert({
                        message,
                        variant: 'danger',
                    });
                    // appContext.setCurrentUser(null);
                });
        }
    };

    if (isLoading) return <Loading />;

    if (error) return <p>Error</p>;

    const onSelectImagesHandler = evt => {
        const imageFiles = Array.from(evt.target.files).map(f => f);
        setSelectedImages(imageFiles);
    };

    const onDeletingImagesChange = evt => {
        // console.log(evt.currentTarget?.value, evt.currentTarget?.checked);

        const fileName = evt.currentTarget?.value;

        if (evt.currentTarget?.checked) {
            setDeletingImages(prev => {
                const images = [...prev];
                images.push(fileName);
                return images;
            });
            // deletingImages.push(evt.currentTarget.value);
        } else {
            // if (i > -1) deletingImages.splice(i, 1);
            // deletingImages.pop(i);
            setDeletingImages(prev => {
                const images = [...prev];
                const i = images.indexOf(fileName);
                if (i > -1) images.pop(i);
                // console.log(i, images)
                return images;
            });
        }
    };

    const onPreviewLocation = () => {
        // setPreviewCoordinates([107, 21]);
        // console.log('formLocation.current?.value', formLocation.current?.value);
        // console.log('formLocationValue', formLocationValue);
        mapRef.current.previewLocation();
    };

    return (
        <PageContainer>
            <h1 className="text-center mb-5">Edit Campground</h1>
            <Wrapper>
                {/* <div className="form-container"> */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="campgroundTitle">
                        <Form.Label>Campground Title</Form.Label>
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
                    <div className="mb-3">
                        <Form.Group className="mb-3" controlId="campgroundLocation">
                            <Form.Label>Location</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control
                                    type="text"
                                    // ref={formLocation}
                                    // defaultValue={campground.location}
                                    required
                                    value={formLocation}
                                    onChange={e => setFormLocation(e.currentTarget.value)}
                                />
                                <InputGroup.Text
                                    className="hover:cursor-pointer hover:bg-teal-200"
                                    onClick={onPreviewLocation}
                                >
                                    Preview location
                                </InputGroup.Text>
                                <Form.Control.Feedback type="valid">
                                    Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Location is required!
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <EditPreviewMap campground={campground} queryLocation={formLocation} ref={mapRef} />
                    </div>

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
                    {/* TODO: NICE TO HAVE: select main image -> set selected image to be images[0] */}
                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <p>Images uploaded ({campground.images.length})</p>

                        <div className="thumbnails-container">
                            {campground.images.map(image => (
                                <UploadedImagesWrapper key={image.url}>
                                    <Image
                                        src={image.thumbnail}
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            objectFit: 'cover',
                                        }}
                                        alt="Thumbnail"
                                        thumbnail
                                    />
                                    {showDeleteCheckboxes && (
                                        <input
                                            type="checkbox"
                                            id={image.url}
                                            value={image.filename}
                                            onChange={onDeletingImagesChange}
                                        />
                                    )}
                                </UploadedImagesWrapper>
                            ))}
                        </div>
                        <Button
                            variant={showDeleteCheckboxes ? 'secondary' : 'warning'}
                            type="button"
                            onClick={() =>
                                setShowDeleteCheckboxes(show => {
                                    if (show) setDeletingImages([]);
                                    return !show;
                                })
                            }
                            size="sm"
                        >
                            {!showDeleteCheckboxes ? (
                                <span>
                                    <Delete /> Select images to delete
                                </span>
                            ) : (
                                <span>Cancel</span>
                            )}
                        </Button>

                        {deletingImages.length > 0 && (
                            <p>
                                Deleting {deletingImages.length}{' '}
                                {deletingImages.length === 1 ? 'image' : 'images'}
                            </p>
                        )}

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
                        <Button variant="secondary" type="submit" disabled>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                as="span"
                            />
                            <span> Updating campground...</span>
                        </Button>
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
                    <button onClick={deleteCampgroundHandler} type="button">
                        Delete campground
                    </button>
                </Form>
            </Wrapper>
            {/* </div> */}
        </PageContainer>
    );
};

export default EditCampground;
