import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, Carousel, Image } from 'react-bootstrap';

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

const CampgroundCardCarousel = ({ campground }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const changeImageHandler = index => {
        // console.log(index);
        setActiveIndex(index);
    };

    return (
        <div>
            <Carousel activeIndex={activeIndex} onSelect={changeImageHandler}>
                {campground.images?.map(image => (
                    <Carousel.Item key={image.url}>
                        <Card.Img
                            variant="top"
                            // TODO: can use virtual here to display transformed imgs from cloudinary for faster speed
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
                        key={image.url}
                        src={image.url.replace('upload/', 'upload/w_200/')} // using cloudinary img transform API
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
        </div>
    );
};

export default CampgroundCardCarousel;
