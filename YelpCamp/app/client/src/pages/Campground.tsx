import React from 'react';
import { Form, useLoaderData, Link } from "react-router-dom";
import { useQuery } from 'react-query';
import axios from 'axios';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
  }

const Campground = () => {
    const { campgroundId } = useLoaderData();

    const { isLoading, error, data: campground } = useQuery({
        queryKey: ['campgroundsData'],
        queryFn: () => axios.get(`/api/v1/campgrounds/${campgroundId}`).then(res => res.data)
    })

  return (
    <div>
        <h1>Campground</h1>
        <p>{campground.title}</p>
        <p>{campground.location}</p>
        <Link to={-1}>Home</Link>
    </div>
  )
}

export default Campground