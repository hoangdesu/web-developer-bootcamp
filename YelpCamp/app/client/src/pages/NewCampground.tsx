import React from 'react';
import { Link } from 'react-router-dom';

const NewCampground = () => {
    return (
        <div>
            <h1>Add a new campground</h1>
            <form action="/api/v1/campgrounds" method="post">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" />

                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" />

                <label htmlFor="price">Price</label>
                <input type="number" step="0.1" id="price" name="price" />

                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" />

                <button>Submit</button>
            </form>
            
            <Link to="/">Home</Link>
        </div>
    );
};

export default NewCampground;
