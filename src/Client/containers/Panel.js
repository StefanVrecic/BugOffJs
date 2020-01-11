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
import MainModal from '../components/UI/Modal/MainModal';
import CardModal from '../components/UI/Modal/CardModal';
import { connect } from 'react-redux';

class Panel extends Component {

    componentDidMount() {
        // alert("check authenticated");
        // check to see if token works?
        this.db_confirmIdentity();
    }
    db_confirmIdentity = () => {

        const instance = axios.create({
            baseURL: 'http://localhost:8080',
            headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
        });
        
        instance.post("/users/checkauth", {
        }).then(response => {
            // alert("success Panel.js");
        })
        .catch(error => {
            alert("Please login. You are being redirected to the login page");
            console.log("failure confirming " + error.config.data);
            this.props.history.push( '/login' );
            window.localStorage.removeItem("login-token");
        });
    }
    state = {
        currentModal: null,
        loadedModal: null,
        panelCard: null
    }
    // move to state
    

    registerModalHandler = (modalFired) =>  {
        console.log(modalFired + " modalFired");
        this.setState({currentModal: modalFired});

        const newLoadedModal = this.modalSelectHandler(modalFired);
        this.setState({loadedModal : newLoadedModal})
    }

    closeModalPanel = () => {
        this.setState({ currentModal : null});
        this.setState({ loadedModal: null});
        // this.loadedModal = null;
    }

    /////////////////////////////////////////// DEADLINE MODAL ///////////////////////////////////////////

    prepareDeadlineModal = () => {
        let upcoming = []; let overdue = [];

        const deadLines = this.data_generateDeadLines();
        overdue = deadLines[0];
        upcoming = deadLines[1];


        return (<DeadlinesModal closeModal={this.closeModalPanel} openCard={this.openDeadLineCard}
            overdueTasks={overdue} upcomingTasks={upcoming}></DeadlinesModal>);
    }
    openDeadLineCard = id => {
        // alert(id + " id panel");
        this.closeModalPanel();
        this.setState({panelCard: id});
        
    } 

    orderByDate = () => {
        const dataArray = [...this.props.dataArray];

        // cleansing - no undefined dates in array.
        let i = 0;
        const toSplice = [];
        for (const c of dataArray) {
            if (c[4] === undefined || c[4] == null) {
                toSplice.push(i);
            }
            i++;
        }
        i = 0;
        
        for (i = 0; i < toSplice.length; i++) { // cleansing ends
            dataArray.splice(toSplice[i]-i, 1); // needs to compensate for the previously removed element
            // no native function for all this?? 
        }

        // for (const c of dataArray) { console.log(c[4]); }
        const sortData = dataArray.sort(this.sortDate);
        // for (const c of sortData) { console.log(c[4]); }
        return sortData;
    }

    sortDate(a, b) {
        const c = 4;
            if (a[c] === b[c]) {
                return 0;
            }
            else {
                return (a[c] < b[c]) ? -1 : 1;
            }
        }

    data_generateDeadLines() {
        console.log("start");
        const now = new Date();
        
        const overdue = [];
        const upcoming = [];
        // gets the from the Redux store
        const dataArray = this.orderByDate();
        for (const d of dataArray) {
            if (d[6] == true) {
                continue; // don't addd items if user already confirmed that they know it's overdue
            }
            if (d[2] == "Closed") {
                // alert(d[1]);
                continue; // do not show closed items in Deadlines modal
            }
            if (d[9] == false) {
                continue; // do not want items that have had their dates (stored, but) disabled
            }
            
            var date = new Date(d[4]);
            if (date > now) {
                upcoming.push(d);
            } else {
                overdue.push(d);
            }
        }
        // target: duedate + description + severity + [ ] + (VIEW)
            // const name = data[1];
            // const status = data[2];
            // const description = data[3];
            // const dueDate = data[4];
            // const severity = data[5];
            // const overdueConfirmed = data[6];
            // const activity = data[7];
        console.log(
            "============================================OVERDUE============================================")
            
        for (const o of overdue) 
        console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
        
        console.log(
            "============================================UPCOMING============================================")

        for (const o of upcoming) 
        console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
        
            const returnArray = [];
            returnArray.push(overdue);
            returnArray.push(upcoming);

            return returnArray;
    }

    ///////////////////////////////////////// END DEADLINE MODAL ///////////////////////////////////////////
    
    prepareNotificationModal = () => {
        return (<NotificationsModal closeModal={this.closeModalPanel}></NotificationsModal>);
    }
    
    /////////////////////////////////////////// ACTIVITY MODAL /////////////////////////////////////////////////
    openActivityHandler = () => {
        // alert(this.props.modalData + " panel.js");
        // alert(this.props.modalData[7] + " panel.js");
        // need to close card modal
        this.registerModalHandler("Activity");
        // this.modalSelectHandler("Activity");
    }
    
    prepareActivityModal = () => {
        if (this.props.modalData.length === 0 || this.props.modalData[7].length === 0) {
            return;
        }
        const cleansed = this.cleanseActivity(this.props.modalData[7]).reverse();
        let events = cleansed;
   

        return (<ActivityModal 
            closeModal={this.closeModalPanel}
            events={events}
            ></ActivityModal> );
    }
    
    cleanseActivity = (data) => {
        const cleansedActivity = [];
    
    for (const d of data) {
        var subDivide = d.split('/timeNoteSplit/');
        var elements = new Object();
        elements.ts = subDivide[0];
        elements.text = subDivide[1];
        cleansedActivity.push(elements)
    }
    return cleansedActivity
}

///////////////////////////////////////// END ACTIVITY MODAL ///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
    prepareAccountModal = () => {
        return (<AccountModal closeModal={this.closeModalPanel} 
            changePass={this.db_changePass}></AccountModal>);
    }

    prepareLogoutModal = () => {
        return (<LogoutModal LogoutModal_logout = {this.db_logout} 
            closeModal={this.closeModalPanel}></LogoutModal>);
    }

    prepareThemeModal = () => {
        return (<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);
    }

    modalSelectHandler = (modalFired) => {
        const buttons = 
        ["View as list", "Notifications", "Activity", "Deadlines", "Teams", "Account", "Theme", "Logout"];

        switch (modalFired) {
            case "CARD": // not entirely necessary :)
                return this.prepareCardModal();

            case buttons[0]:
                return null; //(<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);

            case buttons[1]:  
                return this.prepareNotificationModal();

            case buttons[2]:  
                return this.prepareActivityModal();
            
            case buttons[3]:  
                return this.prepareDeadlineModal();

            case buttons[4]:  
                return null; // (<ThemeModal closeModal={this.closeModalPanel}></ThemeModal>);

            case buttons[5]:  
                return this.prepareAccountModal();
                
            case buttons[6]:  
                return this.prepareThemeModal();
                
            case buttons[7]:  
                return this.prepareLogoutModal();
                
            default: return null;
        }

    }

    
render() {
    // alert("rendering panel");
    const loadedModal = this.state.loadedModal;
    
    return (
            <div className = "userPanel">
                <Sidebar registerModal={this.registerModalHandler}></Sidebar>
                    <TrelloBoard 
                    panelCard={this.state.panelCard}
                    clickedCard={this.clickedCardHandler}
                    viewActivityNotes={this.openActivityHandler}>
                    </TrelloBoard>
                {loadedModal}
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
        // alert("loggingout");
        this.props.history.push( '/login' );
        window.localStorage.removeItem("login-token");
    })
    .catch(error => {
        console.log("failure logut " + error.config.data);
    });
}

}


        // now access the redux with this.props.idArray or this.props.dataArray etc
        const mapStateToProps = state => {
            return {
                idArray: state.idArray,
                dataArray: state.dataArray,
                modalData: state.modalData
            };
        };

        // call via this.props.updateIdArray or this.props.updateDataArray
        const mapDispatchToProps = dispatch => {
            return {
                updateIdArray: (newArray) => dispatch({type: 'idArray_update', payload: newArray}),
                updateDataArray: (newArray) => dispatch({type: 'dataArray_update', payload: newArray}),
            	updateModalData: (newArray) => dispatch({type: 'modalData_update', payload: newArray})
    }; };

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
/////////////////////////////////////////   CARD MODAL       ///////////////////////////////////////////
    // clickedCardHandler = (id) => {
    //     const cardPos = this.cardPositionInArray(id);
    //     const data = this.getCardData(cardPos);
    //     this.props.updateModalData(data);
    //     alert(data);
    //     this.modalSelectHandler("CARD");
    // }


    // prepareCardModal() {
    //     alert("prep card modal");
    //     alert(this.props.modalData);
    //     return (
    //         <CardModal
    //             closeModal={this.closeModalHandler}
    //             // show={this.state.cardModal}
    //             // status={this.state.modalStatus}
    //             // title={this.state.modalTitle}
    //             // data={this.state.modalData}
    //             // color={this.state.modalStatusNumber}
    //             // deleteItemModal={this.deleteItem}
    //             // addDescription={this.addDescriptionHandler}
    //             // addDate={this.saveDateHandler}
    //             // addSeverity={this.saveSeverityHandler}
    //             // postNewNote={this.saveNewNote}
    //         ></CardModal>
    //     );
    // }

    // getCardData(pos) {
    //     const dataArray = [...this.props.dataArray];
    //     return dataArray[pos];
    // }

    // cardPositionInArray(id) {
    //     const idArray = [...this.props.idArray];
    //     const index = idArray.indexOf(id);
    //     return index;
    // }

            // const cardPos = this.cardPositionInArray(id);
            // const title = this.getCardTitle(cardPos);
            // const cardStatus = this.getCardStatus(id);

            // const data = this.getCardData(cardPos);

            // this.setModalTitle(title);
            // this.setModalStatus(cardStatus);
            // this.setActiveCard(id);
            // this.setModalData(data);
            // // alert(data);
            // this.openModalHandler();

///////////////////////////////////////// END CARD MODAL ///////////////////////////////////////////