import React, { Component } from 'react';
import Modal from './Modal';

class ThemeModal extends Component {
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
                ThemeModal
            </Modal>
    );

}

}

export default ThemeModal;