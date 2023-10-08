import React, { memo, useContext } from 'react';
import styled from '@emotion/styled';

import ClearIcon from '@mui/icons-material/Clear';
import { Image } from '../types';
import AppContext from '../store/app-context';
import PrimaryBlackButton from './Buttons/PrimaryBlackButton';

const Container = styled.div<{ image: Image }>`
    .img {
        width: 100%;
        height: 120px;
        background-size: cover;
        box-sizing: border-box;
        z-index: -1;
        background-image: url(${({ image }) => image.thumbnail});
    }

    .remove-icon {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 10;
        display: none;
        color: white;
        background: rgba(82, 72, 72, 0.3);
        border-radius: 50%;
        padding: 6px;
        transform: scale(0.6);
    }

    .remove-icon:hover {
        cursor: pointer;
        background: rgba(82, 72, 72, 0.5);
    }

    &:hover {
        cursor: grab;
        .remove-icon {
            display: block;
        }
    }

    &:active {
        cursor: grabbing;
    }
`;

interface DraggableImageProps {
    image: Image;
    formExistingImages: Image[];
    setFormExistingImages: React.Dispatch<React.SetStateAction<Image[]>>;
    setFormDeletingImages: React.Dispatch<React.SetStateAction<Image[]>>;
}

const DraggableExistingImage: React.FC<DraggableImageProps> = ({
    image,
    formExistingImages,
    setFormExistingImages,
    setFormDeletingImages,
}) => {
    const appContext = useContext(AppContext);

    const softRemoveHandler = evt => {
        if (formExistingImages.length === 1) {
            appContext.setModal({
                open: true,
                content: (
                    <div>
                        <h5>Cannot delete this image</h5>
                        <p>Your campground must have at least 1 image.</p>
                        <PrimaryBlackButton
                            className="mb-0"
                            onClick={evt =>
                                appContext.setModal({
                                    open: false,
                                    content: null,
                                })
                            }
                        >
                            OK
                        </PrimaryBlackButton>
                    </div>
                ),
                requiresLoggedIn: true,
            });
            return;
        }
        setFormDeletingImages(prev => [...prev, image]);
        setFormExistingImages(prev => {
            return prev.filter(existingImg => existingImg.url !== image.url);
        });
    };

    return (
        <Container image={image}>
            <div className="img img-thumbnail" />

            <span className="remove-icon" onClick={softRemoveHandler}>
                <ClearIcon />
            </span>
        </Container>
    );
};

export default memo(DraggableExistingImage);
