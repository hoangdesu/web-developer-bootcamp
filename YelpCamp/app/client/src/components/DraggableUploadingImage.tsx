import React, { memo } from 'react';
import styled from '@emotion/styled';

import ClearIcon from '@mui/icons-material/Clear';
import { UploadImage } from '../types';

const Container = styled.div<{ imageFile: File | Blob }>`
    .img {
        width: 100%;
        height: 120px;
        background-image: url(${({ imageFile }) => URL.createObjectURL(imageFile)});
        background-size: cover;
        box-sizing: border-box;
        z-index: -1;
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
        transition: all 0.1s ease;
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
    imageFile: UploadImage;
    setFormUploadingImages: React.Dispatch<React.SetStateAction<UploadImage[]>>;
}

const DraggableUploadingImage: React.FC<DraggableImageProps> = ({
    imageFile,
    setFormUploadingImages,
}) => {
    const removeImageHandler = () => {
        setFormUploadingImages(prev =>
            prev.filter((uploadImg: UploadImage) => uploadImg.id !== imageFile.id),
        );
    };

    return (
        <Container imageFile={imageFile.file}>
            <div className="img img-thumbnail" />

            <span className="remove-icon" onClick={removeImageHandler}>
                <ClearIcon />
            </span>
        </Container>
    );
};

export default memo(DraggableUploadingImage);
