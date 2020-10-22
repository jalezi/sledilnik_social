import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/List';
import withListLoading from './components/withListLoading';

function App() {
  const ListLoading = withListLoading(List);
  const [appState, setAppState] = useState({
    loading: false,
    stats:null, 
    municipalities:null
 
  });

  
  useEffect(() => {
    setAppState({ loading: true });
    //  const timer = setTimeout(() => {
      fetch(`https://api.sledilnik.org/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setAppState({ stats:data });
      });
      fetch(`https://api.sledilnik.org/api/municipalities`)
      .then((res) => res.json())
      .then((data) => {
        setAppState({ loading: false }, { municipalities:data });
      });
    //  }, 2000);
    //  return () => clearTimeout(timer);

  }, [setAppState]);


  return (
    <div className='App'>
      <div className="top"></div>
      <div className='container'>
        <h1>Sledilnik Social</h1>
      </div>
      <div className='repo-container'>
        <ListLoading isLoading={appState.loading} stats={appState.stats}  />
      </div>
      <footer>
        <div className='footer'>
          Built with{' '}
          <span role='img' aria-label='love'>
            💚
          </span>
        </div><br />
      </footer>
    </div>
  );
}
export default App;