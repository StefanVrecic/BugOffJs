import React, { Component } from 'react';
import Modal from './Modal';

class ActivityModal extends Component {
    state = {
        open: true
    }
    
    componentDidUpdate() {
        if(this.state.open === false) {
            this.props.closeModal(); // see [Modal.js]
        }
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
                ActivityModal
            </Modal>
    );

}

}

export default ActivityModal;