import React from 'react';
import './App.css';
import TrelloBoard from './containers/TrelloBoard';
import Panel from './containers/Panel';
import Auth from './containers/Auth/Auth';
import Modal from './components/UI/Modal/Modal';
import LandingPage from './containers/Landing/LandingPage';
import { Route } from 'react-router-dom';
// import { AuthContext } from './Auth-Context';
import { AuthProvider } from './Auth-Context';
import '../bootstrap.css';


function App() {
  const user = { loggedIn: true }
  return (
    <AuthProvider value={user}>
      
      
      <div className="App" > 
      <Route path = "/auth" exact component = {Auth} />
      <Route path = "/panel" exact component = {Panel} />
      <Route path="/" exact component = {LandingPage} />
    </div>
    </AuthProvider>
    
  );
}

export default App;
