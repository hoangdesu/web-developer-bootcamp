import React, { useContext } from 'react';
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

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);

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

                <p className="mt-3">Total: {campgroundsData && campgroundsData.length} campgrounds</p>
                <ul style={{ paddingLeft: 0 }}>
                    {Array.isArray(campgroundsData) &&
                        campgroundsData.map(campground => {
                            return (
                                <li key={campground._id} style={{ listStyle: 'none', marginBottom: 12 }}>
                                    <CampgroundCard campground={campground} />
                                </li>
                            );
                        })}
                </ul>
            </Container>

            <Footer />
        </PageContainer>
    );
};

export default App;
