import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const EditCampground = () => {
    const { campgroundId } = useLoaderData();
    
    const { isLoading, error, data: campground } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data)
    });
    
    if (isLoading) return <p>Loading...</p>
    
    if (error) return <p>Error</p>

    return (
        <div>
            <h1>Edit campground</h1>

            <form action={`/api/v1/campgrounds/${campground._id}?_method=PUT`} method="post">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" defaultValue={campground.title} />

                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" defaultValue={campground.location} />

                <label htmlFor="price">Price</label>
                <input type="number" step="0.1" id="price" name="price" defaultValue={campground.price} />

                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" defaultValue={campground.description} />

                <button>Save</button>
            </form>
            
            <Link to="/">Home</Link>
        </div>
    );
};

export default EditCampground;
