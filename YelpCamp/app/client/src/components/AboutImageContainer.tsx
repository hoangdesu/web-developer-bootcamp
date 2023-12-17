import React from 'react';

interface ImageContainerProps {
    image: string;
    description: string;
}

const AboutImageContainer: React.FC<ImageContainerProps> = ({ image, description }) => {
    return (
        <div>
            <img src={image} alt={description} className='max-w-[500px] w-full' />
            <p>{description}</p>
        </div>
    );
};

export default AboutImageContainer;
