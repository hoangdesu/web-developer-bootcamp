import styled from '@emotion/styled';
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button = styled.button`
    border: 1px solid black;
    background-color: transparent;
    color: var(--primary-dark-color);
    transition: all 0.1s ease-in-out;
    padding: 10px 3rem;
    margin: 1rem 0;

    &:hover {
        color: black;
        background-color: #f9f3f3;
        cursor: pointer;
    }

    /* Mobile view */
    @media (max-width: 768px) {
        padding: 10px 1rem;
    }
`;

const SecondaryTransparentButton: React.FC<ButtonProps> = props => {
    return (
        <Button {...props} className={props.className}>
            {props.children}
        </Button>
    );
};

export default SecondaryTransparentButton;
