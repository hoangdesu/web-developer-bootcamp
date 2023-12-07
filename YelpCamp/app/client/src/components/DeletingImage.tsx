import styled from '@emotion/styled';
import React, { useState } from 'react';

import RestoreIcon from '@mui/icons-material/Restore';
import { Image } from '../types';

const Container = styled.div`
    &:hover {
        cursor: pointer;
        opacity: 1;
    }

    &:hover img {
        opacity: 0.7;
    }

    .img {
        width: 100%;
        height: 120px;
        background-size: cover;
        object-fit: cover;
        box-sizing: border-box;
        z-index: -1;
        opacity: 0.5;
        transition: all 0.1s ease-in;
    }

    .icon {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        color: var(--primary-dark-color);
        z-index: 10;
        text-align: center;
    }
`;

interface DeletingImageProps {
    image: Image;
}

const DeletingImage: React.FC<DeletingImageProps> = ({ image }) => {
    const [icon, setIcon] = useState(false);

    return (
        <Container onMouseEnter={e => setIcon(true)} onMouseLeave={e => setIcon(false)}>
            <img
                src={image.thumbnail}
                alt="thumbnail"
                draggable={false}
                className="img img-thumbnail"
            />
            <span className="icon">{icon && <RestoreIcon fontSize="large" />}</span>
        </Container>
    );
};

export default DeletingImage;
