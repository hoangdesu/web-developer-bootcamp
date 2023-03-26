import React, { useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground = () => {
    const { campgroundId } = useLoaderData();

    const {
        isLoading,
        error,
        data: campground,
    } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data)
    });

    if (isLoading) return <p>Loading...</p>

    if (error) return <p>Error!</p>

    return (
        <div>
            {campground ? (
                <>
                    <h1>{campground.title}</h1>
                    <h3>
                        {campground.location} - ${campground.price}
                    </h3>
                    <p>{campground.description}</p>
                </>
            ) : (
                <>
                    <p>Error querying campground</p>
                </>
            )}

            <Link to='/'>Home</Link>
            <Link to={`/campgrounds/${campgroundId}/edit`}>Edit</Link>
        </div>
    );
};

export default Campground;
