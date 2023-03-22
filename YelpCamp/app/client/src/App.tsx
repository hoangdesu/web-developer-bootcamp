import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState(null);
  const [campgrounds, setCampgrounds] = useState([]);

  // testing
  const [cg, setCg] = useState('');
  const name = 'briannnn';

  const btnOnClick = (id) => {
    axios.get('/api/v1/campgrounds?id=' + id).then(res => {
      console.log(res.data);
      setCg(res.data);
    });
  }

  useEffect(() => {
    // fetch('/hi?name=' + name)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //     setMsg(data.message);
    //   });

    // axios.get('http://localhost:3001/hi?name=' + name).then(res => {
    axios.get('/api/v1/hi?name=' + name).then(res => {
      console.log(res);
      setMsg(res.data.message);
    });

    axios.get('/api/v1/campgrounds').then(res => {
      setCampgrounds(res.data);
    });


    // NEED React Query, REACT ROUTER
  }, []);

  return (
    <div className="App">
      <p>hey!</p>
      <p>Message: {msg && msg}</p>
      <h1>Campgrounds</h1>
      {campgrounds && <p>Total: {campgrounds.length}</p>}
      <p>Location: {cg && cg.location}</p>
      <ol>
        {campgrounds && campgrounds.map(cg =>
        (
          // <a href={`/api/v1/campgrounds?id=${cg._id}`}>
          //   <li>{cg.title}: "{cg.description}" ${cg.price} at {cg.location} | id: {cg._id}</li>
          // </a>
          <li>{cg.title}: "{cg.description}" ${cg.price} at {cg.location} | id: {cg._id} <button onClick={() => btnOnClick(cg._id)}>Link</button></li>
        ))}
      </ol>
    </div>
  )
}

export default App
