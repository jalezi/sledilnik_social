import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/List';
import withListLoading from './components/withListLoading';
import apiPathObject from './utils/apiPathObject';
import Footer from './components/Footer';

function App() {
  const ListLoading = withListLoading(List);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState(null);
  const [municipalities, setMunicipalities] = useState(null);
  const [hospitalsList, setHospitalsList] = useState(null);
  const [error, setError] = useState(false);
  const [labTests, setLabTests] = useState(false);
  const [summary, setSummary] = useState(false);

  useEffect(() => {
    async function fetchData(url, setState) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setState(data);
      } catch (error) {
        setError(true);
      }
    }

    setLoading(true);
    // const timer = setTimeout(() => { // timer
    const {
      statsPath,
      patientsPath,
      municipalitiesPath,
      hospitals_listPath,
      lab_testsPath,
      summaryPath,
    } = apiPathObject;

    Promise.all([
      fetchData(statsPath, setStats),
      fetchData(patientsPath, setPatients),
      fetchData(municipalitiesPath, setMunicipalities),
      fetchData(hospitals_listPath, setHospitalsList),
      fetchData(lab_testsPath, setLabTests),
      fetchData(summaryPath, setSummary),
    ])
      .catch(() => setError(true))
      .finally(() => setLoading(false)); // show data
    // }, 800);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://sledilnik-social-old.netlify.app/">
          Sledilnik Social Old
        </a>
      </div>
      {error ? console.log(error) : ''}
      <div className="top"></div>
      <div className="container">
        <h1>Sledilnik Social</h1>
        <ListLoading
          isLoading={loading}
          stats={stats}
          municipalities={municipalities}
          patients={patients}
          hospitalsList={hospitalsList}
          labTests={labTests}
          summary={summary}
        />
        <Footer />
      </div>
    </div>
  );
}
export default App;
