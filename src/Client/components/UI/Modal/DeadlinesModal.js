import React, { Component } from 'react';
import Modal from './Modal';
import Button from '../../UI/Button/Button';
import  '../../UI/Button/Button.css';
import '../../../../../src/bootstrap.css';
import './DeadlinesModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
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
    // alert(this.props.upcomingTasks);

    // add button
    // onClick - this.props.openDeadlineItem(o[0])
    // In the parent => set active card, set active modal = card/main
    let styleColor = "red";
    
    let alternate = true;
    for (const o of this.props.overdueTasks) {
      let clockIcon = null;
      if (o[11] > 0) {
        clockIcon = <FontAwesomeIcon icon={faClock} />;
      }
      // alert(o[11] + " ...");
        const theDate = new Date(o[4]).toLocaleString();
        let classes = "bg-redTemp overflow-auto";

        if (alternate) {
          classes = "bg-redTemp alternateRow overflow-auto";
        }
        alternate = !alternate;
        let displayString = "";
        if (o[1].length > 70) {
            displayString = o[1].substring(0,71) + "...";
        } else {
            displayString = o[1];
        }
        let color = "red";
        if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low" || o[5]==="None") { color="green";}
        styleColor = { color: color };
         const item = (
           <div className={classes}>
             <div className="individTemp-date">
               <b>{theDate}</b>
             </div>
             <div>&nbsp;{clockIcon}</div>
             <div className="individTemp-content">
               &nbsp;&nbsp;{displayString}
             </div>
             <div className="individTemp-notes">
               <b>{o[2]}</b>
               <span style={styleColor}>&nbsp;&nbsp;{o[5]}</span>
               <Button btnType="button" clicked={() => this.viewCard(o[0])}>
                 view
               </Button>
             </div>
           </div>
         );  
        overdueTasks.push(item);
    }
    styleColor = "red";
    alternate = true;
    for (const o of this.props.upcomingTasks) {
            let clockIcon = null;
            if (o[11] > 0) {
              clockIcon = <FontAwesomeIcon icon={faClock} />;
            }
        const theDate = new Date(o[4]).toLocaleString();
        let classes = "bg-redTemp overflow-auto";;

        if (alternate) {
          classes = "bg-redTemp alternateRow overflow-auto";
        }
        alternate = !alternate;

        let displayString = "";
        if (o[1].length > 70) {
            displayString = o[1].substring(0,71) + "...";
        } else {
            displayString = o[1];
        }
        let color = "red";
        if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low" || o[5]==="None") { color="green";}
        styleColor = { color: color };
         const item = (
           <div className={classes}>
             <div className="individTemp-date">
               <b>{theDate}</b>
             </div>
             <div>&nbsp;{clockIcon}</div>
             <div className="individTemp-content">
               &nbsp;&nbsp;{displayString}
             </div>
             <div className="individTemp-notes">
               <b>{o[2]}</b>
               <span style={styleColor}>&nbsp;&nbsp;{o[5]}</span>
               <Button btnType="button" clicked={() => this.viewCard(o[0])}>
                 view
               </Button>
             </div>
           </div>
         );  
        upcomingTasks.push(item);
    }
    // for (const o of this.props.upcomingTasks) {
    //     let color = "red";
    //     if (o[5] === "Medium") { color="#FF8C00";} else if (o[5]==="Low") { color="green";}
    //     styleColor = { color: color };
    //     const item = (
    //         <p>{o[4]}    {o[1]}    { o[2] }  <span style={styleColor} >{ o[5] }</span>
    //          <Button btnType="button" clicked={() => this.viewCard(o[0])}>view</Button> 
    //          </p>
    //     );
    //     upcomingTasks.push(item);
    // }

    return (
      <Modal
        show={this.state.open}
        modalClosed={this.closeModalHandler}
        classes="Modal deadlineModal defaultDimensions"
      >
        <div className="deadline-contents">
          <h1 className="deadline-h1 overdue-h1">Overdue</h1>
          <div className="overdueTasksGrid">{overdueTasks}</div>

          <div className="spacingBetweenTypes"></div>
          <h1 className="deadline-h1 upcoming-h1">Upcoming</h1>

          <div className="upcomingTasksGrid">{upcomingTasks}</div>
        </div>
      </Modal>
    );

}

}

export default DeadlinesModal;