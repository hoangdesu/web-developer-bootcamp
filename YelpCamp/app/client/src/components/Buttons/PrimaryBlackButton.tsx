import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (event?: any) => void;
    disabled?: boolean;
}

const HOVER_COLOR = '#4c4c4c';
const DISABLED_COLOR = '#b9a0a0';

const Button = styled.button`
    border: 1px solid black;
    background-color: var(--primary-dark-color);
    color: var(--primary-color);
    transition: all 0.1s ease-in-out;
    padding: 10px 3rem;
    margin: 1rem 0;

    &:hover {
        background-color: ${HOVER_COLOR};
        border: 1px solid ${HOVER_COLOR};
    }

    &:disabled {
        background-color: ${DISABLED_COLOR};
        border: 1px solid ${DISABLED_COLOR};
    }

    /* Mobile view */
    @media (max-width: 768px) {
        padding: 10px 1rem;
    }
`;

const PrimaryBlackButton: React.FunctionComponent<ButtonProps> = props => {
    const { children, className } = props;
    return (
        <Button type="submit" className={className} {...props} disabled={props.disabled}>
            {children}
        </Button>
    );
};

export default PrimaryBlackButton;
