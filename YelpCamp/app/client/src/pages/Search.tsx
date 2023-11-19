import axios from '../config/yelpcampAxios';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import CampgroundCard from './Campground/CampgroundCard';
import { Campground } from '../types';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import NothingFound from '../assets/nothing-found.png';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import ApplyButton from '../components/Buttons/ApplyButton';
import CampgroundsContainer from '../components/CampgroundsContainer';
import { sort } from '../utils/arrayUtils';
import SortIcon from '@mui/icons-material/Sort';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, queryString] = Array.from(searchParams.entries())[0];
    const [queryValue, setQueryValue] = useState(queryString);
    const [sortedCampgrounds, setSortedCampgrounds] = useState<Campground[]>([]);
    const [sortOptions, setSortOptions] = useState(0);
    const [sortText, setSortText] = useState('');

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
        onSuccess: campgrounds => {
            setSortedCampgrounds(campgrounds);
        },
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
        setSortOptions(0);
        setSortText('');
    }, [queryString, searchParams, queryValue]);

    if (isLoading) return <Loading />;

    if (error) return <ErrorBoundary />;

    // handle sort options
    useEffect(() => {
        switch (sortOptions) {
            case 0:
                setSortedCampgrounds(campgrounds);
                setSortText('');
                break;
            case 1:
                setSortedCampgrounds(sort(sortedCampgrounds, 'price', 'lowToHigh'));
                setSortText('Sort by Price: Low to High');
                break;
            case 2:
                setSortedCampgrounds(sort(sortedCampgrounds, 'price', 'highToLow'));
                setSortText('Sort by Price: High to Low');
                break;
            case 3:
                setSortedCampgrounds(sort(sortedCampgrounds, 'rating', 'lowToHigh'));
                setSortText('Sort by Rating: Low to High');
                break;
            case 4:
                setSortedCampgrounds(sort(sortedCampgrounds, 'rating', 'highToLow'));
                setSortText('Sort by Rating: High to Low');
                break;
        }
    }, [sortOptions]);

    return (
        <PageContainer>
            <h1>Results for: {queryValue}</h1>

            <p className="text-muted">
                Found {campgrounds.length} {campgrounds.length > 1 ? 'campgrounds' : 'campground'}{' '}
                {sortText && ` · ${sortText}`}
            </p>

            <Form onSubmit={searchHandler} className="mb-5">
                <InputGroup>
                    <Dropdown>
                        <Dropdown.Toggle id="sort-dropdown">
                            <SortIcon fontSize="small" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => setSortOptions(1)}
                                className={`active:bg-red-200 focus:bg-red-200 ${
                                    sortOptions === 1 ? 'bg-red-200' : ''
                                }`}
                            >
                                Price: Low to High
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setSortOptions(2)}
                                className={`active:bg-red-200 focus:bg-red-200 ${
                                    sortOptions === 2 ? 'bg-red-200' : ''
                                }`}
                            >
                                Price: High to Low
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setSortOptions(3)}
                                className={`active:bg-red-200 focus:bg-red-200 ${
                                    sortOptions === 3 ? 'bg-red-200' : ''
                                }`}
                            >
                                Rating: Low to High
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setSortOptions(4)}
                                className={`active:bg-red-200 focus:bg-red-200 ${
                                    sortOptions === 4 ? 'bg-red-200' : ''
                                }`}
                            >
                                Rating: High to Low
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setSortOptions(0)}
                                className="active:bg-red-200 focus:bg-red-200"
                            >
                                Clear filter
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        ref={searchInputRef}
                        placeholder="Search by name or location..."
                    />
                    <ApplyButton>Search</ApplyButton>
                </InputGroup>
            </Form>

            {sortedCampgrounds.length > 0 ? (
                <CampgroundsContainer length={campgrounds.length}>
                    {sortedCampgrounds.map((campground: Campground) => (
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
