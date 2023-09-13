import React, { useState, useContext, useRef, FormEvent } from 'react';
import { useQueries } from 'react-query';
import axios from 'axios';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { Col, Container, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';

import './App.css';
import AppContext from './store/app-context';

import PageContainer from './components/PageContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClusterMap from './components/ClusterMap';
import CampgroundCard from './components/CampgroundCard';
import FlashAlert from './components/FlashAlert';
import Loading from './pages/Loading';
import { Campground, User } from './types';
import ErrorBoundary from './pages/ErrorBoundary';
import PrimaryBlackButton from './components/Buttons/PrimaryBlackButton';

const CampgroundsContainer = styled.div`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(auto-fit, minmax(262px, 1fr));
`;

const App: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
    const [filteredCampgroundList, setFilteredCampgroundList] = useState<Campground[]>([]);
    const [page, setPage] = useState(1);

    const searchRef = useRef(null);

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
                document.title = 'YelpCamp | Homepage';
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
        // return <p>An error has occurred: {campgroundsQuery.error.message}</p>;
        return <ErrorBoundary error={campgroundsQuery.error} />;
    }

    const onSearchSubmit = (evt: FormEvent) => {
        evt.preventDefault();
        if (!searchRef.current?.value) return;
        navigate(`/search?q=${searchRef.current?.value}`);
    };

    // pagination:
    // page 1: 0 - 11
    // page 2: 12 - 23
    // page 3: 24 - 35
    // => index of page x = (page - 1) * 12
    const onPrevPageClick = () => {
        if (page === 1) return;
        setPage(p => {
            --p;
            const startingIndex = (p - 1) * 12;
            const endingIndex = startingIndex + 12;
            setFilteredCampgroundList(campgrounds.slice(startingIndex, endingIndex));
            return p;
        });
    };

    const onNextPageClick = () => {
        const lastPage = Math.ceil(campgrounds.length / 12);
        if (page === lastPage) return;
        setPage(p => {
            ++p;
            const startingIndex = (p - 1) * 12;
            const endingIndex = startingIndex + 12;
            setFilteredCampgroundList(campgrounds.slice(startingIndex, endingIndex));
            return p;
        });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
        console.log(value);
        console.log(event);

        
    }

    return (
        <PageContainer>
            <Navbar />
            <Container className="my-5 px-[5%]">
                <FlashAlert />
                <ClusterMap campgrounds={campgrounds} />

                <Row className="justify-content-center my-5">
                    <Col>
                        <div className="flex flex-row align-baseline justify-between mb-3">
                            <span className="my-3">
                                Total: {filteredCampgroundList && filteredCampgroundList.length}{' '}
                                campgrounds
                            </span>
                            <form action="" onSubmit={onSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Search campground..."
                                    ref={searchRef}
                                    className="px-3"
                                />
                                <PrimaryBlackButton px={4} py={1}>
                                    Search
                                </PrimaryBlackButton>
                            </form>
                        </div>

                        <CampgroundsContainer>
                            {/* TODO: PAGINATION */}
                            {Array.isArray(filteredCampgroundList) &&
                                filteredCampgroundList.map(campground => {
                                    return (
                                        <CampgroundCard
                                            key={campground._id}
                                            campground={campground}
                                        />
                                    );
                                })}

                            {/* {Array.isArray(campgrounds) &&
                                campgrounds.map(campground => {
                                    return (
                                        <CampgroundCard
                                            key={campground._id}
                                            campground={campground}
                                        />
                                    );
                                })} */}
                        </CampgroundsContainer>

                        {/* TODO: pagination */}
                        <div>
                            <p>Page: {page}</p>
                            <button onClick={onPrevPageClick}>Prev</button>
                            <button onClick={onNextPageClick}>Next</button>
                        </div>

                        <div className="w-full flex flex-column items-center">
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
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default App;
