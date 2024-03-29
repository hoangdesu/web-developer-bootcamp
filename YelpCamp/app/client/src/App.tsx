import React, { useState, useEffect } from 'react';
import { useQueries } from 'react-query';
import axios from './config/yelpcampAxios';


import { Col, Row } from 'react-bootstrap';
import { Pagination, ThemeProvider, createTheme } from '@mui/material';

import './App.css';

import PageContainer from './components/PageContainer';
import ClusterMap from './components/ClusterMap';
import CampgroundCard from './pages/Campground/CampgroundCard';
import Loading from './pages/Loading';
import { Campground, User } from './types';
import ErrorBoundary from './pages/ErrorBoundary';
import CampgroundsContainer from './components/CampgroundsContainer';
import { shuffle } from './utils/arrayUtils';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'qr-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const paginationTheme = createTheme({
    palette: {
        primary: {
            main: '#059669',
        },
    },
});

const App: React.FunctionComponent = () => {
    const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
    const [filteredCampgroundList, setFilteredCampgroundList] = useState<Campground[]>([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

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
                    setFilteredCampgroundList(shuffle(campgroundList).slice(0, 12));
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

    // Pagination:
    // page 1: 0 - 11
    // page 2: 12 - 23
    // page 3: 24 - 35
    // => index of page x = (page - 1) * 12
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const startingIndex = (value - 1) * itemsPerPage;
        const endingIndex = startingIndex + itemsPerPage;
        setFilteredCampgroundList(campgrounds.slice(startingIndex, endingIndex));

        // scroll to top on page change
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const getPaginationInfo = () => {
        if (campgrounds.length === 0) return '0 campgrounds';
        const startingVal = (page - 1) * itemsPerPage;
        const endingVal =
            startingVal + itemsPerPage < campgrounds.length
                ? startingVal + itemsPerPage
                : campgrounds.length;

        return `${startingVal + 1}-${endingVal} of ${campgrounds.length} campgrounds`;
    };

    return (
        <PageContainer>
            <ClusterMap campgrounds={campgrounds} />

            <Row className="justify-content-center my-4">
                <Col>
                    <div className="flex flex-row items-center align-middle justify-between mb-3">
                        <h3 className="my-2">Explore campgrounds</h3>
                    </div>

                    <CampgroundsContainer length={filteredCampgroundList.length}>
                        {Array.isArray(filteredCampgroundList) &&
                            filteredCampgroundList.map(campground => {
                                return (
                                    <CampgroundCard key={campground._id} campground={campground} />
                                );
                            })}
                    </CampgroundsContainer>

                    <div className="w-full flex flex-column items-center mt-5">
                        <ThemeProvider theme={paginationTheme}>
                            <Pagination
                                page={page}
                                count={Math.ceil(campgrounds.length / itemsPerPage)}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                                onChange={handlePageChange}
                            />
                        </ThemeProvider>
                        <p className="pt-3 text-muted text-xs">{getPaginationInfo()}</p>
                    </div>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default App;
