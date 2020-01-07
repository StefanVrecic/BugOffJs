import React, { Component } from 'react';
import Modal from './Modal';

class NotificationsModal extends Component {
    state = {
        open: true
    }

    closeModalHandler = () => {
        this.setState({open: false});
        this.props.closeModal();
    }

render() {

    return (
            <Modal show={this.state.open}
            modalClosed={this.closeModalHandler}
            classes="Modal defaultDimensions">
                NotificationsModal
            </Modal>
    );

}

}

export default NotificationsModal;