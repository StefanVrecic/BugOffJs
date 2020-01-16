import React, { Component } from 'react';
import Modal from './Modal';
// import Timeline from 'react-time-line';
import Timeline from '../Timeline/Timeline';
import './ActivityModal.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class ActivityModal extends Component {
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
    const events = this.props.events;
         const closeIcon = (
       <FontAwesomeIcon
         onClick={this.closeModalHandler}
         className="exitModalIcon-notes"
         icon={faTimes}
       />
       );
    return (
      <Modal
      show={this.state.open}
      modalClosed={this.closeModalHandler}
      classes="Modal dimensions-activity position-activity"
      >
        
      
            {closeIcon}

      
        <div className="overFlow-events">
          <Timeline items={events} deleteItem={this.props.removeNote} />
        </div>
      </Modal>
    );

}

}
// now access the redux with this.props.idArray or this.props.dataArray etc
// const mapStateToProps = state => {
// 	return {
// 		idArray: state.idArray,
// 		dataArray: state.dataArray
// 		// modalData: state.modalData
// 	};
// };

export default ActivityModal;
// export default connect(mapStateToProps)(ActivityModal);