import React, { useState, useContext, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Button, Col, Container, Row } from 'react-bootstrap';

import './App.css';

import AppContext from './store/app-context';

import PageContainer from './components/PageContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CampgroundCard from './components/CampgroundCard';
import Loading from './pages/Loading';

import FlashAlert from './components/FlashAlert';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const CampgroundsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    /* align-items: center; */
    /* justify-content: space-between; */
`;

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const searchRef = useRef(null);

    // console.log('mapbox token:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN)

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(106.7017555);
    const [lat, setLat] = useState(10.7758439); // Vietnam
    const [zoom, setZoom] = useState(6);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
        });

        // map.current.on('move', () => {
        //     setLng(map.current.getCenter().lng.toFixed(4));
        //     setLat(map.current.getCenter().lat.toFixed(4));
        //     setZoom(map.current.getZoom().toFixed(2));
        // });
    });

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

    console.log('🚀 ~ file: App.tsx:52 ~ campgroundsData:', campgroundsData);

    return (
        <PageContainer>
            <Navbar />

            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md="10">
                        <FlashAlert />

                        <div
                            ref={mapContainer}
                            className="map-container"
                            style={{ height: '400px' }}
                        />

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'baseline',
                                justifyContent: 'space-between',
                            }}
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
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default App;

// style={{backgroundColor: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
