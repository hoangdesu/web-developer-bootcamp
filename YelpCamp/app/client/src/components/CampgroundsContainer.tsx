import styled from '@emotion/styled';
import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    length: number;
}

const Div = styled.div<{ length: number }>`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(
        auto-fit,
        minmax(262px, ${props => (props.length < 3 ? '262px' : '1fr')})
    );
`;

const CampgroundsContainer: React.FC<ContainerProps> = ({ children, length }) => {
    return <Div length={length}>{children}</Div>;
};

export default CampgroundsContainer;
