import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/List';
import withListLoading from './components/withListLoading';

function App() {
  const ListLoading = withListLoading(List);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState(null)
  const [municipalities, setMunicipalities] = useState(null)
  const [hospitalsList, setHospitalsList] = useState(null)
  const [error, setError] = useState(false);

  useEffect(() => {
      setLoading(true);
      // const timer = setTimeout(() => { // timer
      const nDaysAgo = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString()
      Promise.all([
          fetch(`https://api.sledilnik.org/api/stats?from=${nDaysAgo}`) // apis
              .then((res) => res.json())
              .then((data) => setStats(data))
              .catch(() => Promise.reject()),
          fetch(`https://api.sledilnik.org/api/patients?from=${nDaysAgo}`)
              .then((res) => res.json())
              .then((data) => setPatients(data))
              .catch(() => Promise.reject()),
          fetch(`https://api.sledilnik.org/api/municipalities?from=${nDaysAgo}`)
              .then((res) => res.json())
              .then((data) => setMunicipalities(data))
              .catch(() => Promise.reject()),
          fetch(`https://api.sledilnik.org/api/hospitals-list`)
              .then((res) => res.json())
              .then((data) => setHospitalsList(data))
              .catch(() => Promise.reject()),
      ])
          .catch(() => setError(true))
          .finally(() => setLoading(false)) // show data
      // }, 800);
      // return () => clearTimeout(timer);
  }, []);

  return (
    <div className='App'>
      { error ? console.log(error) : "" }
      <div className="top"></div>
      <div className='container'>
        <h1>Sledilnik Social</h1>     
        <ListLoading isLoading={loading} stats={stats} municipalities={municipalities} patients={patients} hospitalsList={hospitalsList} />
      </div>
      <footer>
          <br /> <br /><br /> <br />
      </footer>
    </div>
  );
}
export default App;