import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, Carousel, Image } from 'react-bootstrap';
import { Campground } from '../../types';
import { Modal } from '@mui/material';
import YelpcampLogo from '../../assets/logo-original.png';
import CloseIcon from '@mui/icons-material/Close';

const ImageThumbnails = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
    gap: 6px;
    width: 100%;
    overflow-x: scroll;

    & img {
        transition: 0.3s all;
        width: 100px;
        height: 60px;
        object-fit: cover;
    }

    & > img:hover {
        cursor: pointer;
        opacity: 0.8 !important;
    }
`;

interface CarouselProps {
    campground: Campground;
}

const ModalContainer = styled.div`
    img {
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 80%;
        max-width: 80%;
        object-fit: contain;
    }

    #close {
        position: fixed;
        top: 1em;
        right: 1em;
        color: white;
        font-size: 2.5em;
        background: #5f5a5a;
        border-radius: 50%;
        padding: 8px;
        transition: all 0.2s ease;
    }

    #close:hover {
        cursor: pointer;
        background: #7b7272;
    }
`;

const CampgroundCardCarousel: React.FunctionComponent<CarouselProps> = ({ campground }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState('');

    const changeImageHandler = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="mb-5">
            <Carousel activeIndex={activeIndex} onSelect={changeImageHandler}>
                {campground.images?.map((image, index) => (
                    <Carousel.Item key={index}>
                        <Card.Img
                            variant="top"
                            src={image.url}
                            height={'450px'}
                            style={{ objectFit: 'cover' }}
                            onClick={() => {
                                setImage(image.url);
                                setIsModalOpen(true);
                            }}
                            className="hover:cursor-pointer"
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = YelpcampLogo;
                            }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            <ImageThumbnails>
                {campground.images.map((image, i) => (
                    <Image
                        key={i}
                        src={image.thumbnail}
                        alt={image.filename}
                        rounded
                        onClick={() => changeImageHandler(i)}
                        style={{
                            opacity: activeIndex === i ? 1 : 0.6,
                        }}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = YelpcampLogo;
                        }}
                    />
                ))}
            </ImageThumbnails>
            <Modal
                aria-labelledby="image-modal"
                aria-describedby="image-modal"
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <ModalContainer>
                    <div onClick={() => setIsModalOpen(false)}>
                        <CloseIcon id="close" />
                    </div>
                    <img
                        src={image}
                        alt="Campground image"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = YelpcampLogo;
                        }}
                    />
                </ModalContainer>
            </Modal>
        </section>
    );
};

export default CampgroundCardCarousel;
