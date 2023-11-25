import ogAxios, { AxiosError } from 'axios';
import axios from '../config/yelpcampAxios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { Form, InputGroup, Spinner } from 'react-bootstrap';

import PageContainer from '../components/PageContainer';
import Loading from './Loading';

import styled from '@emotion/styled';
import { Autocomplete, LinearProgress } from '@mui/material';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';
import PreviewMap from '../components/PreviewMap';
import AppContext from '../store/app-context';
import { Campground, Image, MapboxFeature, UploadImage } from '../types';

import BackspaceIcon from '@mui/icons-material/Backspace';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../components/Buttons/SecondaryTransparentButton';
import DeletingImage from '../components/DeletingImage';
import DraggableExistingImage from '../components/DraggableExistingImage';
import DraggableUploadingImage from '../components/DraggableUploadingImage';
import HelpIconTooltip from '../components/HelpIconTooltip';
import ModalConfirmDeleteCampground from '../components/Modals/ModalConfirmDeleteCampground';
import { timeDifference } from '../helpers/campground';
import useWindowDimensions from '../hooks/useWindowDimensions';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Wrapper = styled.div<{ length: number }>`
    margin: auto;
    max-width: 600px;

    .grid-item {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 5px;
        position: relative;
    }

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
    const [formChanged, setFormChanged] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [boxesPerRow, setBoxesPerRow] = useState(
        screenWidth > 768 ? 3 : screenWidth < 476 ? 1 : 2,
    );

    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [formCoordinates, setFormCoordinates] = useState<number[]>([]);
    const [formLocation, setFormLocation] = useState('');
    const [previewLocation, setPreviewLocation] = useState('');

    const formTitle = useRef<HTMLInputElement>(null);
    const formPrice = useRef<HTMLInputElement>(null);
    const formDescription = useRef<HTMLInputElement>(null);

    const [formExistingImages, setFormExistingImages] = useState<Image[]>([]);
    const [formDeletingImages, setFormDeletingImages] = useState<Image[]>([]);
    const [formUploadingImages, setFormUploadingImages] = useState<UploadImage[]>([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    // Protect route when user is not logged in
    useEffect(() => {
        document.title = 'YelpCamp | Edit Campground';
        if (!currentUser) navigate('/login');

        const onBeforeUnload = e => {
            e.preventDefault();
            if (formChanged) {
                e.preventDefault();
                e.returnValue = true;
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, []);

    // Resizing preview thumbnail container based on screenWidth
    useEffect(() => {
        setBoxesPerRow(screenWidth > 768 ? 3 : screenWidth < 476 ? 1 : 2);
    }, [screenWidth]);

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
            setFormExistingImages(campground.images);
        },
    });

    // Protect route when user is unauthorized to edit
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
            if (!formLocation) setSuggestedLocations([]);
            ogAxios
                .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${formLocation}.json?access_token=${
                        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
                    }`,
                )
                .then(res => {
                    const features = res.data.features;
                    setSuggestedLocations(features);
                })
                .catch(err => {
                    // ... err msg
                });
        }, 1000);
        return () => clearTimeout(queryLocationTimeOut);
    }, [formLocation]);

    const handleEditCampgroundFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

            // Using geometry data from client
            if (formCoordinates.length > 0) {
                formData.append('campground[geometry][type]', 'Point');
                formData.append('campground[geometry][coordinates]', formCoordinates[0].toString());
                formData.append('campground[geometry][coordinates]', formCoordinates[1].toString());
            }

            // Update existing images
            const campgroundImages = formExistingImages.map(image => ({
                url: image.url,
                filename: image.filename,
            }));
            formData.append('campground[images]', JSON.stringify(campgroundImages));

            // Images to delete
            const imagesToDelete = formDeletingImages.map(img => img.filename);
            formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

            // New images to upload (optional)
            if (formUploadingImages.length > 0) {
                Array.from(formUploadingImages).forEach(image => {
                    formData.append('campground[newImages]', image.file);
                });
            }

            axios
                .put(`/api/v1/campgrounds/${campground._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: currentUser?.id,
                    },
                })
                .then(res => {
                    appContext.setAlert({
                        message: 'Your campground has been updated!',
                        variant: 'success',
                    });
                    navigate(`/campgrounds/${campground._id}`);
                })
                .catch(err => {
                    const errMsg = err.response?.data.toString();
                    console.log('Error: Failed to update campground: ', errMsg);
                    appContext.setSnackbar(true, 'Error: Failed to update campground', 'error');
                    if (err.response?.status === 401) navigate('/login');
                    setIsUpdating(false);
                });
        }
        setValidated(true);
    };

    const deleteCampgroundHandler = () => {
        appContext.setModal({
            open: true,
            content: <ModalConfirmDeleteCampground campground={campground} />,
        });
    };

    const onSelectUploadingImagesHandler = evt => {
        const imageFiles = Array.from(evt.target.files) as File[];

        const images: UploadImage[] = imageFiles.map(file => ({
            id: Math.random().toString(),
            file: file,
        }));

        setFormUploadingImages(prev => prev.concat(images));
    };

    const restoreImageHandler = (evt, image: Image) => {
        setFormDeletingImages(prevDeletingImages => {
            const index = prevDeletingImages.indexOf(image);
            const restoredImage = prevDeletingImages.splice(index, 1);
            return [...prevDeletingImages];
        });

        setFormExistingImages(prev => {
            return [...prev, image];
        });
    };

    const draggingExistingImagesHandler = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId: string,
    ) => {
        const rearrangedImages = swap(formExistingImages, sourceIndex, targetIndex);
        return setFormExistingImages(rearrangedImages);
    };

    const draggingUploadingImagesHandler = (
        sourceId: string,
        sourceIndex: number,
        targetIndex: number,
        targetId: string,
    ) => {
        const rearrangedImages = swap(formUploadingImages, sourceIndex, targetIndex);
        return setFormUploadingImages(rearrangedImages);
    };

    if (isLoading) return <Loading />;

    if (error) return <p>Error</p>;

    return (
        <PageContainer>
            {campground && (
                <Wrapper length={formDeletingImages.length}>
                    <div className="mb-5">
                        <h1 className="text-center mb-3">Edit Campground</h1>
                        <small className="block text-center text-muted text-sm">{`Created ${timeDifference(
                            Date.now(),
                            Date.parse(campground.createdAt),
                        )} · Updated ${timeDifference(
                            Date.now(),
                            Date.parse(campground.updatedAt),
                        )}`}</small>
                    </div>

                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleEditCampgroundFormSubmit}
                        onChange={() => setFormChanged(true)}
                    >
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

                        <Form.Group className="mb-3" controlId="campgroundLocation">
                            <Form.Label>Location</Form.Label>
                            <InputGroup className="mb-3">
                                <Autocomplete
                                    sx={{
                                        width: '100%',
                                        '& input': {
                                            width: '100%',

                                            bgcolor: 'background.paper',
                                            color: theme =>
                                                theme.palette.getContrastText(
                                                    theme.palette.background.paper,
                                                ),
                                        },
                                    }}
                                    options={suggestedLocations}
                                    onChange={(event: any, feature: MapboxFeature) => {
                                        setFormCoordinates(feature.geometry.coordinates);
                                        setPreviewLocation(feature.place_name);
                                    }}
                                    inputValue={formLocation}
                                    onInputChange={(event, newInputValue: string) => {
                                        setFormLocation(newInputValue);
                                    }}
                                    id="location-suggestion-input"
                                    getOptionLabel={(feature: MapboxFeature) =>
                                        `${feature.place_name}`
                                    }
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
                                                placeholder="Start typing to search..."
                                                required
                                            />
                                            <Form.Control.Feedback type="valid">
                                                Looks good!
                                            </Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                Location is required!
                                            </Form.Control.Feedback>
                                        </div>
                                    )}
                                />
                                <InputGroup.Text
                                    className="absolute right-0 hover:cursor-pointer hover:bg-gray-200 text-sm h-[38px]"
                                    onClick={() => {
                                        setFormCoordinates([]);
                                        setPreviewLocation('');
                                        setFormLocation('');
                                    }}
                                >
                                    <BackspaceIcon fontSize="inherit" />
                                </InputGroup.Text>
                            </InputGroup>

                            <PreviewMap coordinates={formCoordinates} location={previewLocation} />
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
                            <Form.Control
                                as="textarea"
                                ref={formDescription}
                                defaultValue={campground.description}
                            />
                            <Form.Control.Feedback type="valid">
                                Description is optional
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* EXISTING IMAGES */}
                        <Form.Group className="mb-3" controlId="campgroundImageUrl">
                            <div className="flex flex-row gap-5 items-center justify-between">
                                <Form.Label>
                                    Uploaded images{' '}
                                    <span className="text-muted text-sm">
                                        ({formExistingImages.length})
                                    </span>
                                </Form.Label>
                                <HelpIconTooltip title={'Drag images to re-arrange'} />
                            </div>

                            <Form.Group controlId="campgroundImageFiles" className="mb-3">
                                <GridContextProvider onChange={draggingExistingImagesHandler}>
                                    <GridDropZone
                                        id="images"
                                        boxesPerRow={boxesPerRow}
                                        rowHeight={130}
                                        style={{
                                            height: `${
                                                130 *
                                                Math.ceil(formExistingImages.length / boxesPerRow)
                                            }px`,
                                        }}
                                    >
                                        {formExistingImages.map(image => (
                                            <GridItem key={`${image.url}`} className="grid-item">
                                                <DraggableExistingImage
                                                    image={image}
                                                    formExistingImages={formExistingImages}
                                                    setFormExistingImages={setFormExistingImages}
                                                    setFormDeletingImages={setFormDeletingImages}
                                                />
                                            </GridItem>
                                        ))}
                                    </GridDropZone>
                                </GridContextProvider>
                            </Form.Group>
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Image URL is required!
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* DELETING IMAGES */}
                        {formDeletingImages.length > 0 && (
                            <Form.Group className="mb-3" controlId="deletingImages">
                                <Form.Label className="flex flex-row gap-2 items-center justify-between">
                                    <span className="text-red-800 font-medium">
                                        Deleting {formDeletingImages.length}{' '}
                                        {formDeletingImages.length > 1 ? 'images' : 'image'}
                                    </span>

                                    <HelpIconTooltip title={'Click on the image to restore'} />
                                </Form.Label>

                                <GridContextProvider onChange={() => {}}>
                                    <GridDropZone
                                        id="images"
                                        boxesPerRow={boxesPerRow}
                                        rowHeight={130}
                                        style={{
                                            height: `${
                                                130 *
                                                Math.ceil(formDeletingImages.length / boxesPerRow)
                                            }px`,
                                        }}
                                    >
                                        {formDeletingImages.map(image => (
                                            <GridItem
                                                key={`${image.url}`}
                                                className="grid-item"
                                                onClick={evt => restoreImageHandler(evt, image)}
                                            >
                                                <DeletingImage image={image} />
                                            </GridItem>
                                        ))}
                                    </GridDropZone>
                                </GridContextProvider>
                            </Form.Group>
                        )}

                        {/* UPLOADING IMAGES */}
                        <Form.Group controlId="campgroundImages" className="mb-3">
                            <Form.Group className="mb-3">
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <Form.Label>
                                        Add more images{' '}
                                        <span className="text-muted text-sm">
                                            ({formUploadingImages.length})
                                        </span>
                                    </Form.Label>
                                    <HelpIconTooltip title={'Drag images to re-arrange'} />
                                </div>
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={onSelectUploadingImagesHandler}
                                />
                                <Form.Control.Feedback type="valid">
                                    Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please select some images
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <GridContextProvider onChange={draggingUploadingImagesHandler}>
                                    <GridDropZone
                                        id="images"
                                        boxesPerRow={boxesPerRow}
                                        rowHeight={130}
                                        style={{
                                            height: `${
                                                130 *
                                                Math.ceil(formUploadingImages.length / boxesPerRow)
                                            }px`,
                                        }}
                                    >
                                        {formUploadingImages.map(image => (
                                            <GridItem key={`${image.id}`} className="grid-item">
                                                <DraggableUploadingImage
                                                    imageFile={image}
                                                    setFormUploadingImages={setFormUploadingImages}
                                                />
                                            </GridItem>
                                        ))}
                                    </GridDropZone>
                                </GridContextProvider>
                            </Form.Group>
                        </Form.Group>

                        <hr />
                        <Form.Group className="mb-2 flex flex-row items-baseline justify-between">
                            <Form.Label>Delete campground</Form.Label>
                            <button
                                onClick={deleteCampgroundHandler}
                                type="button"
                                className="bg-red-700 hover:bg-red-800 border-0 text-white py-2 px-[30px] flex flex-row gap-1 items-center rounded"
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </button>
                        </Form.Group>
                        <hr />

                        <div className="w-full flex flex-row gap-3">
                            {isUpdating ? (
                                <PrimaryBlackButton className="flex-1" disabled={true}>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        as="span"
                                    />
                                    <span> Updating campground...</span>
                                </PrimaryBlackButton>
                            ) : (
                                <PrimaryBlackButton className="flex-1">
                                    Update campground
                                </PrimaryBlackButton>
                            )}

                            <SecondaryTransparentButton onClick={() => navigate(-1)} type="button">
                                Cancel
                            </SecondaryTransparentButton>
                        </div>
                    </Form>
                </Wrapper>
            )}
        </PageContainer>
    );
};

export default EditCampground;
