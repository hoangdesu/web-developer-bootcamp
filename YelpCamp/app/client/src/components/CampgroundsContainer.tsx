import styled from '@emotion/styled';
import React from 'react';

const Div = styled.div`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(auto-fit, minmax(262px, 1fr));
`;
const CampgroundsContainer = ({ children }) => {
    return <Div>{children}</Div>;
};

export default CampgroundsContainer;
