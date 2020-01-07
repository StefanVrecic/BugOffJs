import React, { Component } from 'react';
import Modal from './Modal';

class AccountModal extends Component {
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
                AccountModal
            </Modal>
    );

}

}

export default AccountModal;