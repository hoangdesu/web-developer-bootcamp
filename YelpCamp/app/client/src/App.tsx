import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import { Container } from '@mui/material';

import './App.css';
import { API_V1 } from './constants';

import Navbar from './components/Navbar';

const App = () => {
    const {
        isLoading,
        error,
        data: campgroundsData,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`${API_V1}/campgrounds`).then(res => res.data),
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>An error has occurred: {error.message}</p>;

    return (
        <div>
            <Navbar />

            <Container>
                <p>Total: {campgroundsData.length} campgrounds</p>

                <ol>
                    {Array.isArray(campgroundsData) &&
                        campgroundsData.map(cg => {
                            return (
                                <li key={cg._id}>
                                    <Link to={`campgrounds/${cg._id}`}>
                                        {cg.title} at {cg.location} (${cg.price})
                                    </Link>
                                </li>
                            );
                        })}
                </ol>
            </Container>
        </div>
    );
};

export default App;
