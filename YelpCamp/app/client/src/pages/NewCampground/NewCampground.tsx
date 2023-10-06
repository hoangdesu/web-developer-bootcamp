import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppContext from '../../store/app-context';

import { Container, Form, Button, InputGroup, Spinner, Image } from 'react-bootstrap';

import PageContainer from '../../components/PageContainer';
import FlashAlert from '../../components/FlashAlert';
import ArtImage from '../../assets/new-campground-art.jpg';
import styled from '@emotion/styled';
import PrimaryBlackButton from '../../components/Buttons/PrimaryBlackButton';
import PreviewMap from '../../components/PreviewMap';
import { Autocomplete, LinearProgress } from '@mui/material';
import { GridContextProvider, GridDropZone, GridItem, swap, move } from 'react-grid-dnd';
import DraggableImage from './DraggableImage';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { UploadImage } from '../../types';

const Wrapper = styled.div<{ mouseCoords: { x: number; y: number } }>`
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
        background-position: calc(70% + ${props => props.mouseCoords.x / 100}%);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .grid-item {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 5px;
        position: relative;
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
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const { width: screenWidth } = useWindowDimensions();

    const [validated, setValidated] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [selectedImages, setSelectedImages] = useState<UploadImage[]>([]);
    const [boxesPerRow, setBoxesPerRow] = useState(
        screenWidth > 768 ? 3 : screenWidth < 476 ? 1 : 2,
    );

    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [formLocation, setFormLocation] = useState('');
    const [previewGeometry, setPreviewGeometry] = useState(null);

    const formTitle = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formImages = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    useEffect(() => {
        document.title = 'YelpCamp | New Campground';
        if (!currentUser) {
            appContext.setSnackbar(true, 'You need to login first', 'warning');
            navigate('/login');
        }

        // for moving background effect
        const handleWindowMouseMove = event => {
            setMouseCoords({
                x: event.clientX,
                y: event.clientY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, []);

    // AUTOCOMPLETE LOCATION SEARCH
    useEffect(() => {
        const queryLocationTimeOut = setTimeout(() => {
            if (!formLocation) {
                setSuggestedLocations([])
                // setCoordinates([]);
            };
            axios
                .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${formLocation}.json?access_token=${
                        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
                    }`,
                )
                .then(res => {
                    const coords = res.data.features[0].geometry.coordinates;
                    const features = res.data.features;
                    // const placeText = features[0]['text'];
                    setSuggestedLocations(features);

                    console.log('setSuggestedLocations', features);
                    // console.log('placeText[0]', placeText);
                    // setFormLocation(placeText);
                    // setCoordinates({ longitude: coords[0], latitude: coords[1] });
                })
                .catch(err => {
                    // ... err msg
                });
        }, 1000);
        return () => clearTimeout(queryLocationTimeOut);
    }, [formLocation]);

    // resizing preview thumbnail container based on screenWidth
    useEffect(() => {
        setBoxesPerRow(screenWidth > 768 ? 3 : screenWidth < 476 ? 1 : 2);
    }, [screenWidth]);

    const createCampgroundHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (formImages?.current?.files.length > 10) {
        if (selectedImages.length > 12) {
            alert('Please only select maximum 12 images');
            return;
        }

        // if (formImages?.current?.files.length < 1) {
        if (selectedImages.length < 1) {
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
            formData.append('campground[location]', formLocation);
            formData.append('campground[description]', formDescription.current?.value || '');

            // formData.append('geometry', {
            //     type: 'Point',
            //     coordinates: [108.339537475899, 14.3154241771087],
            // });

            // GETTING GEOMETRY DATA FROM CLIENT:
            // formData.append('campground[geometry][type]', 'Point');
            // formData.append('campground[geometry][coordinates]', 111);
            // formData.append('campground[geometry][coordinates]', 11);

            Array.from(selectedImages).forEach(image => {
                formData.append('campground[images]', image.file);
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
        const imageFiles = Array.from(evt.target.files) as File[];
        // file names can be duplicated
        // using index for the image file causes a tiny flashing animation -> annoying => dont use index for map
        // cannot use math.random() cuz the function component gets rerendering constantly
        const images: UploadImage[] = imageFiles.map(file => ({
            id: Math.random().toString(),
            file: file,
        }));
        setSelectedImages(prev => prev.concat(images)); // adding new images to selected images array
    };

    const draggingImagesHandler = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId: string,
    ) => {
        const rearrangedImages = swap(selectedImages, sourceIndex, targetIndex);
        return setSelectedImages(rearrangedImages);
    };

    return (
        <PageContainer>
            <h1 className="text-center">New Campground</h1>
            <p className="text-center text-muted mt-2 mb-5">
                List your campground on YelpCamp - for FREE!
            </p>
            <Wrapper mouseCoords={mouseCoords}>
                <div className="form-container">
                    <Form
                        className="form"
                        noValidate
                        validated={validated}
                        onSubmit={createCampgroundHandler}
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

                        {/* -- LOCATION -- */}
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
                                onChange={(event, location) => {
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
                                getOptionLabel={location => `${location['place_name']}`}
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
                                            required
                                            placeholder="Start typing to search..."
                                        />
                                    </div>
                                )}
                            />

                            {/* // TODO: new campground should not have marker for initial state. Display marker after user has picked a location */}
                            <PreviewMap
                                campground={null}
                                coordinates={coordinates}
                                location={formLocation}
                            />

                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Location is required!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="priceInput">Price</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    id="priceInput"
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

                        {/* IMAGES */}
                        <Form.Group controlId="campgroundImages" className="mb-3">
                            <Form.Label>Upload images (max 12)</Form.Label>
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
                            <GridContextProvider onChange={draggingImagesHandler}>
                                <GridDropZone
                                    id="images"
                                    boxesPerRow={boxesPerRow}
                                    rowHeight={130}
                                    style={{
                                        height: `${
                                            130 * Math.ceil(selectedImages.length / boxesPerRow)
                                        }px`,
                                    }}
                                >
                                    {selectedImages.map(image => (
                                        <GridItem key={`${image.id}`}>
                                            <div className="grid-item">
                                                <DraggableImage
                                                    image={image}
                                                    setSelectedImages={setSelectedImages}
                                                />
                                            </div>
                                        </GridItem>
                                    ))}
                                </GridDropZone>
                            </GridContextProvider>
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
