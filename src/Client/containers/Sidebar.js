import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {

render() {

    return (
            <div className = "sidebar">
                <input type="button" value="Panel"></input>
                <input className = "top" type="button" value="View as list" ></input>
                <input className = "top" type="button" value="Notifcations" ></input>
                <input className = "top" type="button" value="Activity" ></input>
                <input className = "top" type="button" value="Deadlines" ></input>
                <input className = "top" type="button" value="Teams" ></input>
                <input className = "top" type="button" value="Account" ></input>
                
                <input className = "themeBtn" type="button" value="Theme" ></input>
                <input className="logoutBtn" type="button" value="Logout" onClick={this.props.logoutButton}></input>
            </div>
    );

}

}

export default Sidebar;