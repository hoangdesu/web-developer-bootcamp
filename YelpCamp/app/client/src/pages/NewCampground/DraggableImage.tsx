import React, { memo, useRef } from 'react';
import styled from '@emotion/styled';

import ClearIcon from '@mui/icons-material/Clear';
import { UploadImage } from '../../types';

/* background-image: url(${({ image }) => image.url}); */
/* background-image: url(${({ image }) => image}); */
/* background-image: url(${({ imageFile }) => URL.createObjectURL(imageFile)}); */
// if (imageFile) return 'url(' + URL.createObjectURL(imageFile) + ')';
const Container = styled.div<{ imageFile: File | Blob; imageUrl: string }>`
    /* if (imageUrl) return ''; */
    .img {
        width: 100%;
        height: 120px;
        background-size: cover;
        box-sizing: border-box;
        z-index: -1;
        background-image: ${({ imageFile, imageUrl }) => {
            if (imageFile) return 'url(' + URL.createObjectURL(imageFile) + ')';
            if (imageUrl) return 'url(' + imageUrl + ')';
        }};
    }

    .img-file {
    }

    .img-url {
    }

    .blur {
        opacity: 0.5;
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
    imageFile?: UploadImage;
    imageUrl?: string;
    setFormSelectedImages: React.Dispatch<React.SetStateAction<UploadImage[]>>;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
    imageFile,
    imageUrl,
    setFormSelectedImages,
}) => {

    const containerRef = useRef(null);
    // image could be of type File (for uploading), or just a URL string (for existed images) => change typedef
    const removeImageHandler = () => {
        setFormSelectedImages(prev =>
            prev.filter((uploadImg: UploadImage) => uploadImg.id !== imageFile?.id),
        );
    };

    const softRemove = (e) => {
        console.log(containerRef)
        // imageUrl
        containerRef.current.classList.add('blur')
    }

    return (
        // -- IMG OF TYPE FILE
        // CSS/styled component will try to use the prop value to create classes and construct the component in advance eventhough they're not used at all => cannot create placeholder classes and apply based on types
        // => gotta create separate Containers/div/styled components
        // can try apply separate css file for shared, common classes between containers
        <Container imageFile={imageFile?.file} imageUrl={imageUrl} ref={containerRef}>
            <div className="img img-thumbnail" />
            {/* <img src={thumbnail} width={'300px'} /> */}

            <span className="remove-icon" 
            // onClick={removeImageHandler}
            onClick={softRemove}

            >
                <ClearIcon />
            </span>
        </Container>

        // IMG OF TYPE STRING
        // <div>
        //     {/* <div className="img img-thumbnail" /> */}
        //     <img src={thumbnail} width={'300px'} />

        //     <span className="remove-icon" onClick={removeImageHandler}>
        //         <ClearIcon />
        //     </span>
        // </div>
    );
};

export default memo(DraggableImage);
