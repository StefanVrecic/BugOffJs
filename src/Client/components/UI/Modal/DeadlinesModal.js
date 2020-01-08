import React, { Component } from 'react';
import Modal from './Modal';

class DeadlinesModal extends Component {
    state = {
        open: true
    }

    closeModalHandler = () => {
        this.setState({open: false},
        this.props.closeModal());
    }

    componentDidUpdate() {
        if(this.state.open === false) {
            this.props.closeModal(); // see [Modal.js]
        }
    }
    
render() {

    return (
            <Modal show={this.state.open}
            modalClosed={this.closeModalHandler}
            classes="Modal defaultDimensions">
                DeadlinesModal
            </Modal>
    );

}

}

export default DeadlinesModal;