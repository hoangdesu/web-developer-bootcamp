import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps {
    children: React.ReactNode;
    px?: number;
    py?: number;
}

const Button = styled.button`
    &:hover {
        border: 1px solid black !important;
        background-color: transparent;
        color: black;
    }
`;

// TODO STYLE THIS BUTTON!!
const PrimaryBlackButton: React.FunctionComponent<ButtonProps> = ({ children, px = 5, py = 2 }) => {
    return (
        <Button
            className={`my-3 
                      bg-primary-dark-color
                        text-primary-color 
                        transition 
                        ease-in-out
                        outline-0 
                        px-${px} 
                        py-${py}
                        border-0
                        outline-0
                        duration-200    
                        place-self-end`}
            type="submit"
        >
            {children}
        </Button>
    );
};

export default PrimaryBlackButton;

// bg-emerald-400

// hover:text-white
// hover:bg-emerald-700
// hover:text-black
// hover:bg-white
// hover:border-1
// hover:border-black
