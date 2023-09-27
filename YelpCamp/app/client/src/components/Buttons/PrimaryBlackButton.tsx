import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
}

const Button = styled.button`
    background-color: var(--primary-dark-color);
    color: var(--primary-color);
    border: none;
    transition: all 0.1s ease-in-out;
    padding: 10px 3rem;
    margin: 1rem 0;
    /* align-self: flex-end; */
    /* width: 100%; */

    &:hover {
        background-color: var(--primary-accent-color);
    }
`;

const PrimaryBlackButton: React.FunctionComponent<ButtonProps> = props => {
    const { children, className } = props;
    return (
        <Button type="submit" className={className}>
            {children}
        </Button>
    );
};

export default PrimaryBlackButton;
