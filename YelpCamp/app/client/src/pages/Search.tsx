import axios from '../config/yelpcampAxios';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import CampgroundCard from './Campground/CampgroundCard';
import { Campground } from '../types';
import { Form, InputGroup } from 'react-bootstrap';
import NothingFound from '../assets/nothing-found.png';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import ApplyButton from '../components/Buttons/ApplyButton';
import CampgroundsContainer from '../components/CampgroundsContainer';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, queryString] = Array.from(searchParams.entries())[0];
    const [queryValue, setQueryValue] = useState(queryString);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.title = `YelpCamp | ${queryValue}`;
    }, []);

    const {
        isLoading,
        error,
        data: campgrounds,
        refetch,
    } = useQuery({
        queryKey: ['searchCampgrounds'],
        queryFn: () =>
            axios.get(`/api/v1/campgrounds/search?q=${queryValue}`).then(res => res.data),
    });

    const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchInputRef.current) {
            if (!searchInputRef.current.value) return;
            setQueryValue(searchInputRef.current.value);
            setSearchParams({ q: searchInputRef.current.value });
        }
    };

    // execute the query again after queryString has finished updating
    useEffect(() => {
        setQueryValue(queryString);
        refetch();
    }, [queryString, searchParams, queryValue]);

    if (isLoading) return <Loading />;

    if (error) return <ErrorBoundary />;

    return (
        <PageContainer>
            <h1>Results for: {queryValue}</h1>

            <p className="text-muted">
                Found {campgrounds.length} {campgrounds.length > 1 ? 'campgrounds' : 'campground'}
            </p>

            <Form onSubmit={searchHandler} className="mb-5">
                <InputGroup>
                    <Form.Control
                        ref={searchInputRef}
                        placeholder="Search campground by name or location..."
                    />
                    <ApplyButton>Search</ApplyButton>
                </InputGroup>
            </Form>

            {campgrounds.length > 0 ? (
                <CampgroundsContainer length={campgrounds.length}>
                    {campgrounds.map((campground: Campground) => (
                        <CampgroundCard key={campground._id} campground={campground} />
                    ))}
                </CampgroundsContainer>
            ) : (
                <div className="w-full flex flex-col items-center justify-center gap-3 mt-[100px]">
                    <img src={NothingFound} alt="Nothing found" />
                    <p className="text-muted">Nothing found</p>
                </div>
            )}
        </PageContainer>
    );
};

export default Search;
