import React from 'react';
import './App.css';
import TrelloBoard from './containers/TrelloBoard';
import Modal from './components/UI/Modal/Modal';
import LandingPage from './containers/Landing/LandingPage';

function App() {
  return (

    <div className="App" > 
      {/* <TrelloBoard></TrelloBoard> */}
      {/* <Landing></Landing> */}
      <LandingPage></LandingPage>
    </div>
    
  );
}

export default App;
