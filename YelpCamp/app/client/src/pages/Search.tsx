
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    let [searchParams] = useSearchParams();

    // get query string
    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        // console.log();
        // searchParams.entries()
        for (const entry of searchParams.entries()) {
            console.log(entry, searchParams.get(entry));
        }
    }
    return (
        <div>
            Work in progress...
            <button onClick={handleSubmit}>params</button>
        </div>
    );
};

export default Search;

// https://ultimatecourses.com/blog/query-strings-search-params-react-router
