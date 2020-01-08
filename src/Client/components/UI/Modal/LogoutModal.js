import React, { Component } from 'react';
import Modal from './Modal';

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
                Are you sure you want to log out?
                <input className = "" type="button" value="Yes" onClick={this.props.LogoutModal_logout}></input>
                <input className = "" type="button" value="No" onClick={() => {this.closeModalHandler()} }></input>
            </Modal>
    );

}

}

export default LogoutModal;