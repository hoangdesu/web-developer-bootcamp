import React from 'react';
import { Link, useNavigation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const App = () => {
  const navigation = useNavigation();
  
  const { isLoading, error, data: campgroundsData } = useQuery({
    queryKey: ['campgroundsData'],
    queryFn: () => axios.get('/api/v1/campgrounds').then(res => res.data)
  })

  if (isLoading) return (<p>Loading...</p>)

  if (error) return <p>An error has occurred: {error.message}</p>

  return (
    <div>
        <h1>Home</h1>
        
        <Link to="about">Click to view our about page</Link>
        <br />

        <Link to="campgrounds/testing">Campground</Link>

        <ol>
            {Array.isArray(campgroundsData) && campgroundsData.map(cg => {
                return (
                    <li key={cg._id}>
                        <Link to={`campgrounds/${cg._id}`}>{cg.title} at {cg.location} (${cg.price})</Link>
                    </li>
                )
            })}
        </ol>
    </div>
  )
}

export default App;
