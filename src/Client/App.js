import React from 'react';
import './App.css';
import TrelloBoard from './containers/TrelloBoard';
import Auth from './containers/Auth/Auth';
import Modal from './components/UI/Modal/Modal';
import LandingPage from './containers/Landing/LandingPage';
import { Route } from 'react-router-dom';

function App() {
  return (

    <div className="App" > 
      <Route path = "/auth" exact component = {Auth} />
      <Route path = "/panel" exact component = {TrelloBoard} />
      <Route path="/" exact component = {LandingPage} />
    </div>
    
  );
}

export default App;
