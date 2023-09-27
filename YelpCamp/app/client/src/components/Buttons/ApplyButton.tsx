import styled from '@emotion/styled';
import React from 'react';

const Button = styled.button`
    background: f9f5f1;
    border: 1px solid #ced4da;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    padding: 8px 1rem;
    width: 80px;
    height: 40px;
    transition-property: background-color, color, border;
    transition-timing-function: ease-in;
    transition-duration: 100ms;
    color: inherit;

    &:hover {
        /* background-color: #222325; */
        background-color: var(--primary-accent-color);
        color: #f9f5f1;
        /* border: 1px solid #222325; */
        border: 1px solid var(--primary-accent-color);
    }

    &:active {
        font-size: 15px;
    }
`;

interface ButtonProps {
    children: React.ReactNode;
}

const ApplyButton: React.FC<ButtonProps> = ({ children }) => {
    return <Button className="">{children}</Button>;
};

export default ApplyButton;
