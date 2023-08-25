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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* gap: 16px; */
    /* align-items: center; */
    justify-content: space-between;
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

            <div className="px-[8rem] pt-7">
                <ClusterMap campgrounds={campgroundsData} />
            </div>

            {/* searchbox */}
            <section className="w-[50%] mx-auto mt-[-30px] z-10 flex flex-row justify-center p-2 bg-primary-color">
                <p>hi</p>
                <form action="">
                    <input
                        className="px-5 py-2 drop-shadow-xl"
                        type="text"
                        placeholder="Search campground"
                    />
                    <button>Search</button>
                </form>
            </section>

            <div className="my-5 bg-secondary-color">
                {/* <Map viewState={{ mapCoordinates: coordinates, zoom: 5 }} /> */}

                <Row className="justify-content-center">
                    <Col md="10">
                        <FlashAlert />

                        <div
                            // style={{
                            //     display: 'flex',
                            //     flexDirection: 'row',
                            //     alignItems: 'baseline',
                            //     justifyContent: 'space-between',
                            // }}
                            className="flex flex-row align-baseline justify-between"
                        >
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
            </div>

            <Footer />
        </PageContainer>
    );
};

export default App;

// style={{backgroundColor: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
