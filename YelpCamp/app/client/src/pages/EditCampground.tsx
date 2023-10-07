import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';

import { Container, Button, Form, InputGroup, Image, Spinner } from 'react-bootstrap';

import PageContainer from '../components/PageContainer';
import Loading from './Loading';

import AppContext from '../store/app-context';
import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import PreviewMap from '../components/PreviewMap';
import { Campground } from '../types';
import { Autocomplete, LinearProgress } from '@mui/material';
import { GridContextProvider, GridDropZone, GridItem, swap, move } from 'react-grid-dnd';

import './styles.css';
import Campground from './Campground';
import useWindowDimensions from '../hooks/useWindowDimensions';
import DraggableImage from './NewCampground/DraggableImage';

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

const Wrapper = styled.div<{ length: number }>`
    margin: auto;
    max-width: 600px;

    .thumbnails-container {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: repeat(
            auto-fit,
            minmax(160px, ${props => (props.length < 3 ? '160px' : '1fr')})
        );
    }
`;

const EditCampground: React.FunctionComponent = () => {
    const { campgroundId } = useLoaderData() as { campgroundId: string };
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const { width: screenWidth } = useWindowDimensions();

    const [validated, setValidated] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [formSelectedImages, setFormSelectedImages] = useState<UploadImage[]>([]);
    const [boxesPerRow, setBoxesPerRow] = useState(
        screenWidth > 768 ? 3 : screenWidth < 476 ? 1 : 2,
    );

    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [coordinates, setCoordinates] = useState([105, 20]);
    const [formCoordinates, setFormCoordinates] = useState<number[]>([]);
    const [formLocation, setFormLocation] = useState('');
    const [previewLocation, setPreviewLocation] = useState('');

    const formTitle = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImages = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const [showDeleteCheckboxes, setShowDeleteCheckboxes] = useState(false);
    const [deletingImages, setDeletingImages] = useState<String[]>([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const [editingImages, setEditingImages] = useState([]);

    // function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    //     console.log(targetId, sourceId);
    //     if (targetId) {
    //         const result = move(items[sourceId], items[targetId], sourceIndex, targetIndex);
    //         return setItems({
    //             ...items,
    //             [sourceId]: result[0],
    //             [targetId]: result[1],
    //         });
    //     }

    //     const result = swap(items[sourceId], sourceIndex, targetIndex);
    //     return setItems({
    //         ...items,
    //         [sourceId]: result,
    //     });
    // }

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
        queryFn: () =>
            axios
                .get<Campground>(`/api/v1/campgrounds/${campgroundId}`)
                .then(res => res.data)
                .catch((err: AxiosError) => {
                    throw err;
                }),
        onSuccess: (campground: Campground) => {
            setFormLocation(campground.location);
            setFormCoordinates(campground.geometry.coordinates);
            setPreviewLocation(campground.location);

            // setEditingImages(campground.images);
            // setCampground(campground);
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

    // AUTOCOMPLETE LOCATION SEARCH
    useEffect(() => {
        const queryLocationTimeOut = setTimeout(() => {
            // console.log('formLocation', formLocation);
            if (!formLocation) setSuggestedLocations([]);
            axios
                .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${formLocation}.json?access_token=${
                        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
                    }`,
                )
                .then(res => {
                    const coords = res.data.features[0].geometry.coordinates;
                    const features = res.data.features;
                    const placeText = features[0]['text'];
                    console.log('setSuggestedLocations', features);
                    console.log('placeText[0]', placeText);
                    // setFormLocation(placeText);
                    setSuggestedLocations(features);

                    // setCoordinates({ longitude: coords[0], latitude: coords[1] });
                })
                .catch(err => {
                    // ... err msg
                });
        }, 1000);
        return () => clearTimeout(queryLocationTimeOut);
    }, [formLocation]);

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

            // adding new images
            // TODO: MERGE EXISTED IMAGE AND ADDING MORE IMAGES TO A SINGLE ARRAY
            // MODIFY ARRAY AND FINALLY APPEND TO FORMDATA BEFORE SAVING
            // OVERWRITE CURRENT IMAGES ARRAY IN DB
            formData.append('campground[images]', formImages.current?.files[0]);
            Array.from(formImages.current?.files).forEach(file => {
                formData.append('campground[images]', file);
            });

            deletingImages.forEach(img => formData.append('deletingImages[]', img));

            // swapping featured image
            // formData.append('featuredImageIndex', featuredImageIndex);
            // if (featuredImageIndex !== 0) {
            // }

            // formImages.current?.files

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

        // return;

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
        const imageFiles = Array.from(evt.target.files);
        setFormSelectedImages(imageFiles);
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

    // const previewLocation = () => {
    //     console.log('inside preview location');

    //     axios
    //         .get(
    //             `https://api.mapbox.com/geocoding/v5/mapbox.places/${formLocation}.json?access_token=${
    //                 import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    //             }`,
    //         )
    //         .then(res => {
    //             const coords = res.data.features[0].geometry.coordinates;
    //             const features = res.data.features;
    //             const placeText = features[0]['text'];
    //             console.log('res.data.features', features);
    //             console.log('placeText', placeText);
    //             setFormLocation(placeText);

    //             // setCoordinates({ longitude: coords[0], latitude: coords[1] });
    //         })
    //         .catch(err => {
    //             // ... err msg
    //         });
    // };

    function onDragEnd(result) {
        console.log('result', result);
        const newItems = [...editingImages];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setEditingImages(newItems);
        console.log('editingImages before', editingImages);
    }

    function onImagesChange(sourceId, sourceIndex, targetIndex, targetId) {
        console.log(targetId, sourceId);
        if (targetId) {
            // const result = move(items[sourceId], items[targetId], sourceIndex, targetIndex);
            // return setItems({
            //     ...items,
            //     [sourceId]: result[0],
            //     [targetId]: result[1],
            // });
        }

        // const result = swap(items[sourceId], sourceIndex, targetIndex);
        // return setItems({
        //     ...items,
        //     [sourceId]: result,
        // });

        console.log('source:', sourceIndex, 'targetInd', targetIndex);
        const result = swap(editingImages, sourceIndex, targetIndex);
        console.log('result', result);
        setEditingImages(result);
    }

    const draggingImagesHandler = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId: string,
    ) => {
        const rearrangedImages = swap(formSelectedImages, sourceIndex, targetIndex);
        return setFormSelectedImages(rearrangedImages);
    };

    return (
        <PageContainer>
            <Wrapper length={campground.images.length}>
                <h1 className="text-center mb-5">Edit Campground</h1>
                {/* <div className="form-container"> */}
                <p> // basic campground information</p>
                <p>
                    created at:{campground.createdAt}, modified at: {campground.modifiedAt}
                </p>

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
                            <Autocomplete
                                sx={{
                                    width: '100%',
                                    marginBottom: '1rem',
                                    '& input': {
                                        width: '100%',
                                        bgcolor: 'background.paper',
                                        color: theme =>
                                            theme.palette.getContrastText(
                                                theme.palette.background.paper,
                                            ),
                                    },
                                }}
                                // value={formLocation}
                                onChange={(event: any, location: string | null) => {
                                    // setValue(newValue);
                                    // setFormLocation(newValue); //lowercase error
                                    console.log('on change', 'new value', location);
                                    setCoordinates(location.geometry.coordinates);
                                }}
                                inputValue={formLocation}
                                onInputChange={(event, newInputValue) => {
                                    setFormLocation(newInputValue);
                                    console.log('onInputChange', newInputValue);
                                }}
                                id="location-suggestion-input"
                                getOptionLabel={location =>
                                    `${location.text} (${location['place_name']})`
                                }
                                options={suggestedLocations}
                                filterOptions={(options, state) => options}
                                freeSolo
                                loading={!!formLocation}
                                loadingText={
                                    <div className="text-primary-accent-color">
                                        <LinearProgress color="inherit" />
                                    </div>
                                }
                                renderInput={params => (
                                    <div ref={params.InputProps.ref}>
                                        <input
                                            type="text"
                                            {...params.inputProps}
                                            className="form-control"
                                        />
                                    </div>
                                )}
                            />

                            <PreviewMap coordinates={formCoordinates} location={previewLocation} />

                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Location is required!
                            </Form.Control.Feedback>
                        </Form.Group>
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
                    {/* // TODO: replace selecting images to delete mechanism. Hover to display a delete icon. Click to add to delete list */}
                    <Form.Group className="mb-3" controlId="campgroundImageUrl">
                        <Form.Label>Images uploaded ({campground.images.length})</Form.Label>

                        <div className="thumbnails-container">
                            <Form.Group controlId="campgroundImageFiles" className="mb-3">
                                <GridContextProvider onChange={draggingImagesHandler}>
                                    <GridDropZone
                                        id="images"
                                        boxesPerRow={boxesPerRow}
                                        rowHeight={130}
                                        style={{
                                            // height: `${
                                            //     130 *
                                            //     Math.ceil(formSelectedImages.length / boxesPerRow)
                                            // }px`,
                                            height: '500px'
                                        }}
                                    >
                                        {/* {formSelectedImages.map(image => ( */}
                                        {/* use a state array to modify */}
                                        // TODO: fix this
                                        {campground.images.map(image => (
                                            <GridItem key={`${image.url}`}>
                                                <div className="grid-item">

                                                    <DraggableImage
                                                        imageUrl={image.thumbnail}
                                                        setFormSelectedImages={
                                                            setFormSelectedImages
                                                        }
                                                    />

                                                    {/* <img
                                                        src={image.thumbnail}
                                                        alt=""
                                                        width={'200px'}
                                                    /> */}
                                                </div>
                                            </GridItem>
                                        ))}
                                    </GridDropZone>
                                </GridContextProvider>
                            </Form.Group>
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

                    <Form.Group controlId="updloadImages" className="mb-3 thumbnails-container">
                        {/* use a different array to keep track of images to be uploaded */}

                        {/* {selectedImages &&
                            selectedImages.map(img => (
                                <Image
                                    key={img}
                                    src={URL.createObjectURL(img)}
                                    style={{
                                        width: '100%',
                                        // width: selectedImages.length < 3 ? '160px' : '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                    }}
                                    alt="Thumbnail"
                                    thumbnail
                                />
                            ))} */}
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
