import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, Carousel, Image } from 'react-bootstrap';
import { Campground } from '../types';

const ImageThumbnails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 8px;
    gap: 6px;
    /* opacity: 0.8; */

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

const CampgroundCardCarousel: React.FunctionComponent<CarouselProps> = ({ campground }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const changeImageHandler = index => {
        // console.log(index);
        setActiveIndex(index);
    };
    
    // if (campground.images.length > 0) console.log('images')

    return (
        <>
            {/* TODO: DEFAULT IMAGE IF NO IMAGE SELECTED */}
            <Carousel activeIndex={activeIndex} onSelect={changeImageHandler}>
                {campground.images?.map((image, index) => (
                    <Carousel.Item key={index}>
                        <Card.Img
                            variant="top"
                            src={image.url}
                            height={'400px'}
                            style={{ objectFit: 'cover' }}
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
        </>
    );
};

export default CampgroundCardCarousel;
