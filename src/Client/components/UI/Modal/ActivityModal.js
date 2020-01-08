import React, { Component } from 'react';
import Modal from './Modal';
import Timeline from 'react-time-line';

class ActivityModal extends Component {
    state = {
        open: true
    }
    
    componentDidUpdate() {
        if (this.props.show === true && this.state.open === false) { // fix later
            this.setState({ open: true});
        }
        // if(this.state.open === false) {
            // this.props.closeModal(); // see [Modal.js]
        // }
    }
    
    componentDidMount() {
        alert("mounting");
    }

    closeModalHandler = () => {
        this.setState({open: false});
        this.props.closeModal();
    }

render() {
    const events = this.props.events;
    return (
            <Modal show={this.props.show}
            modalClosed={this.closeModalHandler}
            classes="Modal defaultDimensions">
                ActivityModal
                
 
{/* <Timeline />  */}
<Timeline items={events} /> 
            </Modal>
    );

}

}

export default ActivityModal;