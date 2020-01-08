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
        if (this.props.show === true && this.state.open === false) { // fix later
            this.setState({ open: true});
        }
        // if(this.state.open === false) {
            // this.props.closeModal(); // see [Modal.js]
        // }
    }
    
render() {
    const overdueTasks = []; const upcomingTasks = [];


    // add button
    // onClick - this.props.openDeadlineItem(o[0])
    // In the parent => set active card, set active modal = card/main
    for (const o of this.props.overdueTasks) {
        const item = (
            <p>{o[4]}    {o[1]}    { o[2] } - [c] - { o[0] } </p>
        );
        overdueTasks.push(item);
    }

    for (const o of this.props.upcomingTasks) {
        const item = (
            <p>{o[4]}   {o[1]}   { o[2] } - [c] - { o[0] } </p>
        );
        upcomingTasks.push(item);
    }

    return (
            <Modal show={this.state.open}
            modalClosed={this.closeModalHandler}
            classes="Modal defaultDimensions">
                DeadlinesModal
                {/* {this.props.overdueTasks} */}
                <h1>Overdue</h1><br></br>
                {overdueTasks}<br></br>
                <h1>Upcoming</h1><br></br>
                {upcomingTasks}
            </Modal>
    );

}

}

export default DeadlinesModal;