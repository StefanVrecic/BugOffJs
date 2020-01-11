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
               <div className="logoutBtn-container">
               <div className = "logoutBtnModal" >
                <button onClick={this.props.LogoutModal_logout} className="">
                      Yes
                  </button>
               </div>
               </div>
               
        <br></br>

        <div className="logoutBtn-container">
        <div className = "logoutBtnModal" >
                <button onClick={() => {this.closeModalHandler()} } className="">
                      No
                  </button>
               </div>
</div>
                </Modal>
    );

    

}

}

export default LogoutModal;