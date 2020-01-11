import React, { Component } from 'react';
import Modal from './Modal';
import Button from '../../UI/Button/Button';
import  '../../UI/Button/Button.css';
import '../../../../../src/bootstrap.css';

class DeadlinesModal extends Component {
    state = {
        open: true
    }

    closeModalHandler = () => {
        this.setState({open: false},
        this.props.closeModal());
    }

    viewCard = (id) => {
        this.props.openCard(id);
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
    alert(this.props.upcomingTasks);

    // add button
    // onClick - this.props.openDeadlineItem(o[0])
    // In the parent => set active card, set active modal = card/main
    let styleColor = "red";
    for (const o of this.props.overdueTasks) {
        const theDate = new Date(o[4]).toLocaleString();
        let displayString = "";
        if (o[1].length > 70) {
            displayString = o[1].substring(0,71) + "...";
        } else {
            displayString = o[1];
        }
        let color = "red";
        if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low") { color="green";}
        styleColor = { color: color };
        const item = (
            <p><b>{theDate}</b> -- {displayString}    <b>{ o[2] }</b> - [c] - <span style={styleColor} >{ o[5] }</span>
             <Button btnType="button" clicked={() => this.viewCard(o[0])}>view</Button> 
             </p>
        );  
        overdueTasks.push(item);
    }
    styleColor = "red";
    for (const o of this.props.upcomingTasks) {
        const theDate = new Date(o[4]).toLocaleString();
        let displayString = "";
        if (o[1].length > 70) {
            displayString = o[1].substring(0,71) + "...";
        } else {
            displayString = o[1];
        }
        let color = "red";
        if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low") { color="green";}
        styleColor = { color: color };
        const item = (
            <p><b>{theDate}</b> -- {displayString}    <b>{ o[2] }</b> - [c] - <span style={styleColor} >{ o[5] }</span>
             <Button btnType="button" clicked={() => this.viewCard(o[0])}>view</Button> 
             </p>
        );  
        upcomingTasks.push(item);
    }
    // for (const o of this.props.upcomingTasks) {
    //     let color = "red";
    //     if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low") { color="green";}
    //     styleColor = { color: color };
    //     const item = (
    //         <p>{o[4]}    {o[1]}    { o[2] } - [c] - <span style={styleColor} >{ o[5] }</span>
    //          <Button btnType="button" clicked={() => this.viewCard(o[0])}>view</Button> 
    //          </p>
    //     );
    //     upcomingTasks.push(item);
    // }

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