import React, { useState, useEffect } from 'react';
import { Form, useLoaderData, Link } from 'react-router-dom';
import axios from 'axios';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const Campground = () => {
    const { campgroundId } = useLoaderData();
    const [campground, setCampground] = useState({
        title: '',
        location: '',
        price: 0,
        description: '',
    });

    useEffect(() => {
        axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => setCampground(res.data));
    }, []);

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
        </div>
    );
};

export default Campground;
