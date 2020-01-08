import React, { Component } from 'react';
import TrelloBoard from './TrelloBoard';
import Sidebar from './Sidebar';
import axios from "axios";
import './Panel.css';
import NotificationsModal from '../components/UI/Modal/NotificationsModal';
import ActivityModal from '../components/UI/Modal/ActivityModal';
import DeadlinesModal from '../components/UI/Modal/DeadlinesModal';
import AccountModal from '../components/UI/Modal/AccountModal';
import ThemeModal from '../components/UI/Modal/ThemeModal';
import LogoutModal from '../components/UI/Modal/LogoutModal';

class Panel extends Component {


    state = {
        currentModal: null
    }
    // move to state
    loadedModal = null;
    

    registerModalHandler = (modalFired) =>  {
        console.log(modalFired);
        this.setState({currentModal: modalFired});

        this.loadedModal = this.modalSelectHandler(modalFired);
        
    }

    closeModalPanel = () => {
        this.setState({ currentModal : null});
        this.loadedModal = null;
    }

    modalSelectHandler = (modalFired) => {
        const buttons = 
        ["View as list", "Notifications", "Activity", "Deadlines", "Teams", "Account", "Theme", "Logout"];

        switch (modalFired) {
            case buttons[0]:
                return null; //(<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);

            case buttons[1]:  
                return (<NotificationsModal closeModal={this.closeModalPanel}></NotificationsModal>);

            case buttons[2]:  
                return (<ActivityModal closeModal={this.closeModalPanel}></ActivityModal>);

            case buttons[3]:  
                return (<DeadlinesModal closeModal={this.closeModalPanel}></DeadlinesModal>);

            case buttons[4]:  
                return null; // (<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);

            case buttons[5]:  
                return (<AccountModal closeModal={this.closeModalPanel} 
                    changePass={this.db_changePass}></AccountModal>);

            case buttons[6]:  
                return (<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);

            case buttons[7]:  
                return (<LogoutModal LogoutModal_logout = {this.db_logout} 
                    closeModal={this.closeModalPanel}></LogoutModal>);

            default: break;
        }

    }

    
render() {
    
    
    return (
            <div className = "userPanel">
                <Sidebar registerModal={this.registerModalHandler}></Sidebar>
                <TrelloBoard></TrelloBoard>

                {this.loadedModal}
            </div>
    );

}

db_changePass = (currentPass, newPass) => {
 const instance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
      });
      const sendEmail = window.localStorage.getItem("email");
      console.log(sendEmail + " sendEmail");
      console.log(currentPass + " / " + newPass);
        instance.patch("/users/changepass", {
            email: sendEmail,
            password: currentPass,
            newPassword: newPass
          })
          .then(() =>  {
            console.log("success changing pass");
          })
          .then(() => {
                console.log("suc change pass")
            }).catch(() => {
            console.log("fail change");
            // console.log(error.config.data);
          });
      }


db_logout = () => {
    const instance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
      });

      instance.post("/users/logout", {
    }).then(response => {
        console.log("success logout" + response);
        this.props.history.push( '/' );
    })
    .catch(error => {
        console.log("failure logut " + error.config.data);
    });
}

}

export default Panel;