import React from 'react';
import './App.css';
import Panel from './containers/Panel';
import LandingPage from './containers/Landing/LandingPage';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './Auth-Context';
import '../bootstrap.css';


function App() {
  const user = { loggedIn: true }
  return (
    <AuthProvider value={user}>
      
      
      <div className="App" > 
      {/* <Route path = "/auth" exact component = {Auth} /> */}
      <Route path = "/panel" exact component = {Panel} />
      <Route path="/login" exact component = {LandingPage} />
      <Route path="*"><Redirect to="/login" /></Route>
    </div>
    </AuthProvider>
    
  );
}

export default App;
