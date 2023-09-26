import React, { useState, useContext, useRef, FormEvent, useEffect } from 'react';
import { useQueries } from 'react-query';
import axios from 'axios';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { Col, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';

import './App.css';
import AppContext from './store/app-context';

import PageContainer from './components/PageContainer';
import ClusterMap from './components/ClusterMap';
import CampgroundCard from './pages/Campground/CampgroundCard';
import Loading from './pages/Loading';
import { Campground, User } from './types';
import ErrorBoundary from './pages/ErrorBoundary';
import SearchBox from './components/SearchBox';
import CampgroundsContainer from './components/CampgroundsContainer';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'qr-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
    const [filteredCampgroundList, setFilteredCampgroundList] = useState<Campground[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        document.title = 'YelpCamp';
    }, []);

    const [userAuthQuery, campgroundsQuery] = useQueries([
        {
            queryKey: ['userAuth'],
            queryFn: () => axios.get('/api/v1/auth/currentuser').then(res => res.data),
            onSuccess: (authUser: User) => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

                if (!currentUser) {
                    localStorage.removeItem('currentUser');
                } else {
                    localStorage.setItem('currentUser', JSON.stringify(authUser));
                }
            },
        },
        {
            queryKey: ['campgroundsData'],
            queryFn: () => axios.get(`/api/v1/campgrounds`).then(res => res.data),
            onSuccess: (campgroundList: Campground[]) => {
                setCampgrounds(() => {
                    setFilteredCampgroundList(campgroundList.slice(0, 12));
                    return campgroundList;
                });
            },
        },
    ]);

    if (campgroundsQuery.isLoading) return <Loading />;

    if (campgroundsQuery.error) {
        console.error(campgroundsQuery.error);
        return <ErrorBoundary err={campgroundsQuery.error} />;
    }

    // pagination:
    // page 1: 0 - 11
    // page 2: 12 - 23
    // page 3: 24 - 35
    // => index of page x = (page - 1) * 12
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const startingIndex = (value - 1) * 12;
        const endingIndex = startingIndex + 12;
        setFilteredCampgroundList(campgrounds.slice(startingIndex, endingIndex));
    };

    return (
        <PageContainer>
            <ClusterMap campgrounds={campgrounds} />

            <Row className="justify-content-center my-4">
                <Col>
                    {/* <div className="flex flex-col md:flex-row items-center align-middle justify-between mb-3"> */}
                    <div className="flex flex-row items-center align-middle justify-between mb-3">
                        {/* <div> */}
                        <h3 className="my-4">Explore campgrounds</h3>

                        <SearchBox />
                        {/* TODO: make this shit repsonsive in mobile */}
                    </div>

                    <CampgroundsContainer>
                        {Array.isArray(filteredCampgroundList) &&
                            filteredCampgroundList.map(campground => {
                                return (
                                    <CampgroundCard key={campground._id} campground={campground} />
                                );
                            })}
                    </CampgroundsContainer>

                    <div className="w-full flex flex-column items-center mt-5">
                        <Pagination
                            page={page}
                            count={Math.ceil(campgrounds.length / 12)}
                            color="secondary"
                            variant="outlined"
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    </div>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default App;
