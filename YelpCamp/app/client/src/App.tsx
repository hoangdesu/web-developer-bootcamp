import React, { useState, useContext, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { Button, Col, Container, Row } from 'react-bootstrap';

import './App.css';
import AppContext from './store/app-context';

import PageContainer from './components/PageContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClusterMap from './components/ClusterMap';
import CampgroundCard from './components/CampgroundCard';
import FlashAlert from './components/FlashAlert';
import Loading from './pages/Loading';

const CampgroundsContainer = styled.div`
    /* display: flex;
    flex-direction: row;
    flex-wrap: wrap; */
    /* gap: 16px; */
    /* align-items: center; */
    /* justify-content: space-between; */

    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(auto-fit, minmax(262px, 1fr));
`;

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const searchRef = useRef(null);

    useEffect(() => {
        axios.get('/api/v1/auth/currentuser').then(res => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser) {
                localStorage.removeItem('currentUser');
            } else {
                localStorage.setItem('currentUser', JSON.stringify(res.data));
            }
        });
        
        console.log('env:', import.meta.env);
        // console.log('process.env config:', process.env);

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

    const onSearchSubmit = evt => {
        evt.preventDefault();
        if (!searchRef.current?.value) return;
        navigate(`/search?q=${searchRef.current?.value}`);
    };

    return (
        <PageContainer>
            <Navbar />
            <Container className="my-5 px-[5%]">
                <FlashAlert />
                {/* <div className=""> */}
                <ClusterMap campgrounds={campgroundsData} />
                {/* </div> */}

                <Row className="justify-content-center my-5">
                    <Col>
                        <div className="flex flex-row align-baseline justify-between">
                            <span className="my-3">
                                Total: {campgroundsData && campgroundsData.length} campgrounds
                            </span>
                            <form action="" onSubmit={onSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Search campground..."
                                    ref={searchRef}
                                />
                                <Button variant="info" type="submit">
                                    Search
                                </Button>
                            </form>
                        </div>

                        <CampgroundsContainer>
                            {Array.isArray(campgroundsData) &&
                                campgroundsData.map(campground => {
                                    return (
                                        <CampgroundCard
                                            key={campground._id}
                                            campground={campground}
                                        />
                                    );
                                })}
                        </CampgroundsContainer>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default App;
