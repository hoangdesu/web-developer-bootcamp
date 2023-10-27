import styled from '@emotion/styled';
import React from 'react';
import PageContainer from '../components/PageContainer';
import TriangleSpinner from '../components/TriangleSpinner';

const Container = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Loading = () => {
    return (
        <>
            <PageContainer>
                <Container>
                    <TriangleSpinner
                        height="60"
                        width="60"
                        color="#4d8531"
                        ariaLabel="yelpcamp-loading-spinner"
                    />
                </Container>
            </PageContainer>
        </>
    );
};

export default Loading;
