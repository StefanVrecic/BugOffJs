import React, { Component } from 'react';
import Modal from './Modal';
import './LogoutModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
      const closeIcon = (
        <FontAwesomeIcon
          onClick={this.props.closeModal}
          className="exitModalIcon-log"
          icon={faTimes}
        />
      );
    return (
      <Modal
        show={this.state.open}
        classes={"Modal dimensions-logout"}
        modalClosed={this.closeModalHandler}
      >
        <div className="logoutItems">
          {closeIcon}
          <br></br>
          <h2>Logout of app?</h2>
          <br></br>
          <div className="logoutBtn-container">
            <div className="logoutBtnModal">
              <button onClick={this.props.LogoutModal_logout} className="">
                Logout
              </button>
            </div>
          </div>

          <br></br>

          <div className="logoutBtn-container">
            <div className="logoutBtnModal">
              <button
                onClick={() => {
                  this.closeModalHandler();
                }}
                className=""
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );

    

}

}

export default LogoutModal;