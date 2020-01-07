import React, { Component } from 'react';
import TrelloBoard from './TrelloBoard';
import Sidebar from './Sidebar';
import axios from "axios";
import './Panel.css';

class Panel extends Component {

    logout = () =>  {
        this.db_logout();
    }
    
render() {

    return (
            <div className = "userPanel">
                <Sidebar logoutButton={this.logout}></Sidebar>
                <TrelloBoard></TrelloBoard>
            </div>
    );

}


db_logout() {
    const instance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
      });

      instance.post("/users/logout", {
    })
        .then(response => {
        console.log("success logout" + response);
        this.props.history.push( '/' );
    })
    .catch(error => {
        console.log("failure logut " + error.config.data);
    });
}

}

export default Panel;