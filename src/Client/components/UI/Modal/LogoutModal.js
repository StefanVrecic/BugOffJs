import React, { Component } from 'react';
import Modal from './Modal';
import './LogoutModal.css';

class LogoutModal extends Component {
    state = {
        open: true
    }

    closeModalHandler = () => {
        this.setState({open: false});
        this.props.closeModal();
    }

    componentDidUpdate() {
        if(this.state.open === false) {
            this.props.closeModal(); // see [Modal.js]
        }
    }

render() {
    
    return (
            <Modal show={this.state.open}
            classes={"Modal logoutModal"}
            modalClosed={this.closeModalHandler}>
               <br></br>
               <h2>Are you sure you want to log out?</h2>
               <br></br>
               <div className = "logoutYes" >
                <input type="button" value="Yes" onClick={this.props.LogoutModal_logout}></input>
               </div>
        <br></br>
                <input className = "logoutNo" type="button" value="No" onClick={() => {this.closeModalHandler()} }></input>
            </Modal>
    );

}

}

export default LogoutModal;