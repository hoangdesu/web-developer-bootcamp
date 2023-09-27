import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Card, Carousel, Image } from 'react-bootstrap';
import { Campground } from '../../types';
import AppContext from '../../store/app-context';
import { Box, Modal } from '@mui/material';

const ImageThumbnails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 8px;
    gap: 6px;
    /* opacity: 0.8; */

    // TODO: use GRID display for thumbnail container
    /* display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 100px)); */

    & > img {
        transition: 0.3s all;
    }

    & > img:hover {
        cursor: pointer;
        opacity: 0.8 !important;
    }
`;

interface CarouselProps {
    campground: Campground;
}

const style = {
    position: 'fixed',
    top: '5vh',
    left: 'calc(50% - (1500px/2))',
    transform: 'translate(-50%, -50%)',
    height: '200vh',
    // width: '500px',
    // backgroundColor: 'white',
    padding: '3rem',
    // borderRadius: '16px',
    // boxShadow: '0 2px 8px rgba(6, 5, 5, 0.25)',
    zIndex: '100',
    animation: 'slide-down 300ms ease-out forwards',
    outline: 'none',

    '@keyframes slide-down': {
        from: {
            opacity: 0,
            // transform: 'translateY(3rem)',
        },
        to: {
            opacity: '1',
            transform: 'translate(0)',
        },
    },

    '@media (max-width: 600px)': {
        // background: 'red',
        left: 'calc(50% - (90%/2))',
        width: '90%',
    },
};

const CampgroundCardCarousel: React.FunctionComponent<CarouselProps> = ({ campground }) => {
    const appContext = useContext(AppContext);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState('');

    const changeImageHandler = (index: number) => {
        // console.log(index);
        setActiveIndex(index);
    };

    // if (campground.images.length > 0) console.log('images')
    // TODO: clicking on each image (OR A FULLSCREEN ICON) will show big size in CUSTOM MODAL
    return (
        <section className="mb-5">
            {/* TODO: DEFAULT IMAGE IF NO IMAGE SELECTED */}
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
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            <ImageThumbnails>
                {campground.images?.map((image, i) => (
                    <Image
                        key={i}
                        src={image.thumbnail} // using cloudinary img transform API
                        alt={image.filename}
                        width={'100px'}
                        height={'60px'}
                        rounded
                        onClick={() => changeImageHandler(i)}
                        style={{
                            opacity: activeIndex === i ? 1 : 0.6,
                            objectFit: 'cover',
                        }}
                    />
                ))}
            </ImageThumbnails>
            <Modal
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <Box sx={style}>
                    <img src={image} alt="" width={'1500px'} />
                    {/* use a % number here */}
                </Box>
            </Modal>
        </section>
    );
};

export default CampgroundCardCarousel;
