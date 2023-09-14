import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, queryString] = Array.from(searchParams.entries())[0];
    const [queryValue, setQueryValue] = useState(queryString);

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

    // get query string
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // console.log();
        // searchParams.entries()
        for (const entry of searchParams.entries()) {
            console.log(entry);
        }
    };

    const searchHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        let params = { q: queryValue };
        setSearchParams(params);
        refetch();
    };

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error</p>;

    return (
        <div>
            <form onSubmit={searchHandler}>
                <input type="text" value={queryValue} onChange={e => setQueryValue(e.currentTarget.value)} />
                <button type="submit">Search</button>
            </form>
            <div>
                {campgrounds.length} results
                {campgrounds &&
                    campgrounds.map(campground => (
                        <div key={campground._id}>
                            <p>{campground.title}</p>
                            <p>- Location: {campground.location}</p>
                            <Link to={`/campgrounds/${campground._id}`}>Visit</Link>
                        </div>
                    ))}
            </div>

            <button onClick={handleSubmit}>params</button>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Search;

// https://ultimatecourses.com/blog/query-strings-search-params-react-router
