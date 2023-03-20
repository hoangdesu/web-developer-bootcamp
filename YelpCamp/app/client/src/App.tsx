import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState(null);
  const name = 'briannnn';

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
  }, []);

  return (
    <div className="App">
      <p>hey!</p>
      <p>Message: {msg && msg}</p>
    </div>
  )
}

export default App
