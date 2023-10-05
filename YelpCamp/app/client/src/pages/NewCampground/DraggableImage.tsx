import React, { memo } from 'react';
import styled from '@emotion/styled';

const Container = styled.div<{ image: File | Blob }>`
    .img {
        width: 100%;
        height: 120px;
        background-image: url(${({ image }) => URL.createObjectURL(image)});
        background-size: cover;
        box-sizing: border-box;
        z-index: -1;
    }

    .remove-icon {
        position: absolute;
        top: 10px;
        right: 16px;
        z-index: 10;
        display: none;
    }

    .remove-icon:hover {
        cursor: pointer;
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
    image: File | Blob;
    setSelectedImages: () => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, setSelectedImages }) => {
    console.log(image);

    const removeImageHandler = () => {
        setSelectedImages(prev => prev.filter((img: File | Blob) => img.file.name !== image.name));
    };
    return (
        <Container image={image}>
            <div className="img img-thumbnail" />

            {/* // TODO: hover on image should display X icon to remove */}
            <span className="remove-icon" onClick={removeImageHandler}>
                X
            </span>
        </Container>
    );
};

export default memo(DraggableImage);
