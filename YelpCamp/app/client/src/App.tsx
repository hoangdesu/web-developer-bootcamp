import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container } from 'react-bootstrap';

import './App.css';

import AppContext from './store/app-context';

import PageContainer from './components/PageContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CampgroundCard from './components/CampgroundCard';
import Loading from './pages/Loading';

import FlashAlert from './components/FlashAlert';
import styled from '@emotion/styled';

const CampgroundsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
`;

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        axios.get('/api/v1/auth/currentuser').then(res => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser) {
                localStorage.removeItem('currentUser');
            } else {
                localStorage.setItem('currentUser', JSON.stringify(res.data));
            }
        });
    }, [localStorage]);

    const {
        isLoading,
        error,
        data: campgroundsData,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`/api/v1/campgrounds`).then(res => res.data),
    });

    if (isLoading) return <Loading />;

    if (error) return <p>An error has occurred: {error.message}</p>;

    return (
        <PageContainer>
            <Navbar />

            <Container className="col-8 my-3">
                <FlashAlert />

                <h5 className="my-3">
                    Total: {campgroundsData && campgroundsData.length} campgrounds
                </h5>

                <CampgroundsContainer>
                    {Array.isArray(campgroundsData) &&
                        campgroundsData.map(campground => {
                            return <CampgroundCard campground={campground} />;
                        })}
                </CampgroundsContainer>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default App;
