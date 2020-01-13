import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {
    buttons = ["View as list", "Notifications", "Activity", "Deadlines", "Teams", "Account", "Theme", "Logout"];


    render() {
        
    return (
        <div className = "sidebar">
            {/* <input type="button" value="Panel"></input> */}
            {/* <input className = "top" type="button" value={this.buttons[0]} 
                onClick={() => { this.props.registerModal(this.buttons[0])}} ></input> */}

            {/* <input className = "top" type="button" value={this.buttons[1]} 
                onClick={() => { this.props.registerModal(this.buttons[1])}} ></input> */}

            {/* <input className = "top" type="button" value={this.buttons[2]} 
                onClick={() => { this.props.registerModal(this.buttons[2])}} ></input> */}
            
            <input className = "top" type="button" value={this.buttons[3]} 
                onClick={() => { this.props.registerModal(this.buttons[3])}} ></input>
            
            {/* <input className = "top" type="button" value={this.buttons[4]} 
                onClick={() => { this.props.registerModal(this.buttons[4])}} ></input> */}
            
            <input className = "bottomBtn" type="button" value={this.buttons[5]} 
                onClick={() => { this.props.registerModal(this.buttons[5])}} ></input>
           
           {/* bottom */}
            
            {/* <input className = "themeBtn" type="button" value={this.buttons[6]} 
                onClick={() => { this.props.registerModal(this.buttons[6])}} ></input> */}
            
            <input className="logoutBtn" type="button" value={this.buttons[7]} 
                onClick={() => { this.props.registerModal(this.buttons[7])}}></input>
        </div>
    );

}

}

export default Sidebar;