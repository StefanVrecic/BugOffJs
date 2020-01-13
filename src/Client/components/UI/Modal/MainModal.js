import React, { Component } from "react";
import "./Modal.css";
import Auxiliary from "../../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import "../../../../bootstrap.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Form from "react-bootstrap/Form";

import "./MainModal.css";
import ConfirmationModal from "./ConfirmationModal";

class MainModal extends Component {
  // shouldComponentUpdate (nextProps, nextState) {
  //         if (nextProps.show !== this.props.show || nextProps.children !== this.props.children ) {
  //             return true;
  //         }
  //     }

  constructor(props) {
    super(props);
    this.state = {
      closed: true,
      cardText: "",
      editing: false,
      descriptionArea: "",
      date: "",
      startDate: new Date(),
      severity: "",
      addNote: "",
      noteArea: "",
      disableCalendar: true,
      option: "empty",
      reprod: "empty",
      sever: "empty",
      deleteItemModal: false,
      startAllowCalendar: "empty",
      stateNewCard: false,
      newTitleSet: false,
      newTitle: "",
      oldNoteArea: "",
      alertTimer: "empty",
      alertMeChecked: "empty"
    };

    this.textInput = React.createRef();
    this.saveNewCardTitle = this.saveNewCardTitle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    // this.escFunction = this.escFunction.bind(this);
  }
  
    bugProperties = ["id", "name", "status", "description", "dueDate", "severity", "overdueConfirmed", "activity", "bugReproducible", "alertTimer"];
        
        p = title => {
          return this.bugProperties.indexOf(title);
      }

    getMinReminderTime = () => {
      const now = new Date();
      const time = this.state.startDate;
      const minimumReminder = Math.ceil((time - now) / 3600000) - 2; // explain later
      return minimumReminder;
    }

  handleCalendarChange = date => {
    
    this.setState({
      startDate: date
    });

    this.props.addDate(date);
    // if calendar is put to time in past, disable alerts
        const now = new Date();

        if (date < now) {
          this.setState({ alertMeChecked: false });
          this.props.saveAllowAlert(false);
        } 
            // cannot have reminders before present moment, now, nor with 1 hour of now -- what's the point?
    let minTime = this.getMinReminderTime();
    let setTimer = this.state.alertTimer;

    
    const nowpt = (now.getTime() + (setTimer * 3600000)) + 3600000 + ((60-now.getMinutes()-1)*60000);
    const earliestCalendarTime = new Date(nowpt);
    
    // as above, factoring in the timer number - alternatively reduce timer instead of disabling
    if (date < earliestCalendarTime) { 
                this.setState({ alertMeChecked: false });
                return this.props.saveAllowAlert(false);
    }


    if (setTimer > minTime) { 
      setTimer = minTime;
    }
    

 
    
      if (minTime < 1) {
        this.setState({ alertMeChecked: false });
        setTimer = 0;
      }

    this.setState({alertTimer: setTimer});

    // due date set in the future. Allow alert => incase item was overdue and user changed duedate to time in future
    if (date > now) { 
      // item dueDatePassed => true
      // db call + state change...
    }

  };

  changeTimer = (event) => {
    
    // alert(minTime);
    let setTimer = event.target.value;
    if (setTimer > 48) {
      setTimer = 48;
    event.target.value = 48;
    } 


    // cannot have reminders before present moment, now, nor with 1 hour of now -- what's the point?
    const minTime = this.getMinReminderTime();
    if (setTimer > minTime) { 
      setTimer = minTime;
    }
        if (setTimer < 1) {
          setTimer = 0;
          event.target.value = 0;
        }
    this.setState({alertTimer: setTimer});
  }

  checkAlert = (e) => {
    if (this.state.disableCalendar) {
      return;
    }
    const minTime = this.getMinReminderTime();
    if (minTime < 1) { // not enough clearance for a reminder
      this.setState({ alertMeChecked: false });
      this.setState({alertTimer: 0}); // cosmetic for UI
      this.props.saveAllowAlert(false);
      return;
    }

        let setTimer = this.state.alertTimer;
        const now = new Date();

        const nowpt = now.getTime() + setTimer * 3600000 + 3600000 + (60 - now.getMinutes() - 1) * 60000;
        const earliestCalendarTime = new Date(nowpt);
        const date = this.state.startDate;
        // as above, factoring in the timer number - alternatively reduce timer instead of disabling
        if (date < earliestCalendarTime) {
          this.setState({ alertMeChecked: false });
          return this.props.saveAllowAlert(false);
        }
    // if calendar is set in past, checkbox = false
    // if alert is set in past, checkbox = false OR just send a minimum reminder?
    
    
    if (this.state.startDate < now) {
      this.setState({ alertMeChecked: false});
      this.props.saveAllowAlert(false);
    } else {
      this.setState({alertMeChecked: e.target.checked});
      this.props.saveAllowAlert(e.target.checked);
    }

  }

  saveDueDateEnabled = (event) => {

  }

  confirmDeleteItem = () => {
    this.setState({deleteItemModal: false});
    this.props.deleteItemModal();
  }
  rejectDeleteItem = () => {
    this.setState({deleteItemModal: false});
  }
  deleteItemConfirmation = () => {
      this.setState({deleteItemModal: true});
  }

  saveSeverity = (event) => {
    this.setState({sever: event.target.value});
    this.props.addSeverity(event.target.value);
  }

  saveReproducible = (event) => {
    
    this.setState({reprod: event.target.value});
    this.props.addReproducible(event.target.value);
  }

  saveStatus = (event) => {
    this.setState({option: event.target.value});
    this.props.saveStatus(this.props.data[0], event.target.value);
  }
  componentDidUpdate() {
    if (this.props.data.length > 0 && this.state.alertTimer === "empty") {
      this.setState({alertTimer: this.props.data[11]});
    }
    if (this.props.data.length > 0 && this.state.option === "empty") {
      this.setState({option: this.props.status});
    }
    if (this.props.data.length > 0 && this.state.sever === "empty") {
      this.setState({sever: this.props.data[5]});
    }
    if (this.props.data.length > 0 && this.state.reprod === "empty") {
      this.setState({reprod: this.props.data[8]});
    }
    if (this.props.data.length > 0 && this.state.alertMeChecked === "empty") {
      // this.setState({alertMeChecked: this.props.data[10]});
    }
    if (this.props.data.length > 0 && this.state.startAllowCalendar === "empty") {
      if (this.props.data[9] === true) { //  allow calendaar
      
      this.setState({disableCalendar: false});
      this.setState({startAllowCalendar: false});
      
    } else { // don't allow calendar
    this.setState({disableCalendar: true});
    this.setState({startAllowCalendar: true});
      }
    } 
  }
  
  escFunction = (event) => {
    if(this.state.closed === true && event.keyCode === 27) {
      // maybe keylistener doesn't provide latest ?
      // this is partly broken. Settings transfer to the next modal that shows up.
    this.closeModal();
    }
  }

  componentDidMount() {
    // document.addEventListener("keydown", this.escFunction, false);
    
  }

	handleInputChange(event)  {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
	
		this.setState({
		  [name]: value
		});
	  }

  setSeverity = eventKey => {
    this.setState({ severity: eventKey });
    this.props.addSeverity(eventKey);
  };

  addNewNote = () => {
    const note = this.state.noteArea;
    if (note !== "")
      this.props.postNewNote(note);
    this.setState({ noteArea: ""});
  };

  setEditing = () => {
    // state = editing => button value = "save" => user wants to save description
    if (this.state.editing) {
      this.props.addDescription(this.state.descriptionArea);
    }
    this.setState({ descriptionArea: this.props.data[3] });
    this.setState({ editing: !this.state.editing });
  };

  toggleCalendar = () => {
    this.props.saveCalendarEnabled(this.state.disableCalendar); // !!this.state.disableCalendar
    // if calendar is disabled=true => dueDateEnabled => false
    // if we toggle it => calendar is enabled=false => dueDateEnabled = true
    // thus if calendar is disabled=true and we hit toggle, we set dueDateEnabled = true;
    // thus at current time dueDateEnabled = (!!) disabled 
    if (this.state.disableCalendar === false) { // === true as not yet toggled
      this.setState({alertMeChecked: false});
      this.props.saveAllowAlert(false);
    }
    this.setState({disableCalendar: !this.state.disableCalendar});
  }

  closeModal = () => {
    // reset properties for next modal
    
    
    let setTimer = this.state.alertTimer;
    // alert("hr: " + setTimer);
    
    if (setTimer > 48) {
      setTimer = 48;
    } if (setTimer < 1) {
      setTimer = 0;
    }
    
    this.props.setReminder(setTimer);
    
    this.setState({
      closed: true,
      cardText: "",
      editing: false,
      descriptionArea: "",
      option: "empty",
      reprod: "empty",
      sever: "empty",
      startAllowCalendar: "empty",
      alertMeChecked: "empty",
      alertTimer: "empty",
      stateNewCard: false
    });
    this.setState({ date: "", startDate: new Date(), severity: "" });
    
    this.props.modalClosed();
  };

  cancelNewTitle = () => {
    this.setState({stateNewCard: !this.state.stateNewCard});
    this.setState({noteArea: this.state.oldNoteArea});
  }

  saveNewCardTitle = () => {
    let currentTitle = this.props.title;
    if (this.state.newTitleSet === true) {
      currentTitle = this.state.newTitle;
    }
    
    this.setState({stateNewCard: !this.state.stateNewCard});
    if (!this.state.stateNewCard === true) {
      // edit
      this.textInput.current.focus();
      this.setState({oldNoteArea: this.state.noteArea});
      this.setState({noteArea: currentTitle});
    }
    if (!this.state.stateNewCard === false) {
      // save
      
      this.props.saveNewTitle(this.state.noteArea);
      this.setState({newTitleSet: true});
      this.setState({newTitle: this.state.noteArea});
      this.setState({noteArea: this.state.oldNoteArea});
    }
    
  }

  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {

    let titleToDisplay = this.props.title;
    if (this.state.newTitleSet === true) {
      titleToDisplay = this.state.newTitle;
    }
    
    let confirmationModal;
    if (this.state.deleteItemModal) {
        confirmationModal = (
          <ConfirmationModal confirmDelete={this.confirmDeleteItem}
          closeModal={this.rejectDeleteItem} ></ConfirmationModal>
        );
      }

      let viewNotesDisabled = false;
    if (this.props.data.length === 0 || this.props.data[7].length === 0) {
      viewNotesDisabled = true;
  }
    let selectedTime = new Date();
    if (this.props.data[4] != undefined) {
      selectedTime = new Date(this.props.data[4]);
    }    
    let newCard = null;
    
    let notesOrTitle = (
      <textarea
      className="notesTextArea"
      placeholder="Add a new note (250 characters max)"
      maxlength="250"
      cols="45"
      rows="5"
      wrap="soft"
      name="noteArea"
      ref={this.textInput}
      onChange={this.handleInputChange}
      value={this.state.noteArea}
      ></textarea>
    );
    
    let editOrSave = "Edit";
    let editOrSaveTitle = "Edit";
    let cancelSaveTitle = null;
    
    if (this.state.stateNewCard) {
        editOrSaveTitle = "Save";
        cancelSaveTitle = <span className = "editTitle" onClick={this.cancelNewTitle}> / Cancel </span>
        notesOrTitle = (
          <textarea
          className="notesTextArea"
          placeholder="Add a new title (81 characters max)"
          maxlength="81"
          cols="45"
          rows="5"
          wrap="soft"
          name="noteArea"
          ref={this.textInput}
          onChange={this.handleInputChange}
          value={this.state.noteArea}
          ></textarea>
        );
      }

      let displayEditing = <p className="displayDescription">{this.props.data[3]}</p>;
    
      if (this.state.editing) {
      editOrSave = "Save";
      displayEditing = (
        <div>
          <textarea
            className="descriptionTextArea"
            placeholder="Add a more detailed description"
            maxlength="1000"
            cols="75"
            // rows="15"
            wrap="soft"
            name="descriptionArea"
            onChange={this.handleInputChange}
            value={this.state.descriptionArea}
            ></textarea>
        </div>
      );
    }
    let displayCalendar = "";
    
    // if (this.state.startAllowCalendar === true)

    let onOffButton = "Off";
    
    if (!this.state.disableCalendar) {
      displayCalendar = (
        <DatePicker
          selected={selectedTime}
            className="calendarComponent"
            timeIntervals={15}
                  onChange={this.handleCalendarChange}
                    showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      />); 
      } else {
        onOffButton = "On";
        displayCalendar = (
          <DatePicker
            disabled
            placeholderText="Press 'ON' to select deadline"
            className="calendarComponent greyed"
            />);
  }

  
  
    return (
      <Auxiliary>
        <Backdrop show={this.props.show} clicked={this.closeModal} />
        <div
          className="Modal defaultDimensions"
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
              opacity: this.props.show ? "1" : "0"
          }} >
          <div className="modalTitle">
            
            <span className="modalTitle-header">
              <b>{titleToDisplay}</b> <span onClick={this.saveNewCardTitle} className = "editTitle">{editOrSaveTitle}</span>{cancelSaveTitle}
            </span>
            
            {newCard}
            
            <br></br>
            </div>
            <div className = "modalTitle-status-container">
            <span
              className={`modalTitle-status 
                            titleColor-${this.props.color}`}
            >
             
              ({this.props.status})
            </span>
          </div>


                <div className="itemDescription">
          {displayEditing}
                </div>
                
                <div className=" zeroWidth">
            <div className=" ">

                    <button onClick={this.setEditing} className="editBtn nopadding">
                      {editOrSave}
                  </button>
                  </div>
                </div>
          {/* <br></br>
          <br></br> */}
        <div className = "bugSettings">
          <div className="date-Reminder">
            <div className="date-Reminder--toggle"> 
             {displayCalendar}

                    <button onClick={this.toggleCalendar} className="onOffBtn nopadding disableDate">
                      {onOffButton}
                  </button>

            </div>  
            <div>
              <input className="input-checkbox100"  id="ckb2" checked={this.props.data[10]} type="checkbox"
  name="sign-up" onChange = { this.checkAlert }/>
							<label className="label-checkbox100" for="ckb2">
              Email me </label>
              {/* value={this.props.data[11]} */}
                <input className="timerItem" type="number" min="1"  max="48" value={this.state.alertTimer} step="1" onChange={this.changeTimer} name="alertTimer" />
              <span> hours before due date</span>
            </div>
          </div>

          <div className="bugFields">
            <div className="dropdownButtons">
              <div className="blah">
                <div className="bug-reproducible--form">
                  <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Bug reproducible?</Form.Label>
                      <Form.Control value={this.state.reprod} onChange={this.saveReproducible} size="sm" as="select">
                        <option>None</option>
                        <option>Consistently</option>
                        <option>Intermittently</option>
                        <option>Rarely/once</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </div>
                <div className="zeroWidth mainModalBtn-spacing addNote-btn">
                    <button onClick={this.addNewNote} className="editBtn nopadding">
                      Add Note
                  </button>
                </div>
              </div>
              <div className="blah">
                <div className="bug-reproducible--form">
                  <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Bug severity?</Form.Label>
                      <Form.Control value={this.state.sever} onChange={this.saveSeverity} size="sm" as="select">
                        <option>None</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </div>
    
                <div className="zeroWidth mainModalBtn-spacing viewNotes-btn">
                    <button disabled={viewNotesDisabled} onClick={this.props.viewNotes} className="editBtn nopadding ">
                      View notes
                  </button>
                </div>
              </div>
          </div>

          <div className="notesTextAreaContainer">
            {notesOrTitle}
          </div>

          <div className="settings-3">
                <div className="changeStatus--form">
                  <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Change status?</Form.Label>
                      <Form.Control value={this.state.option} onChange={this.saveStatus} size="sm" as="select">
                        <option>Open</option>
                        <option>In progress</option>
                        <option>To be tested</option>
                        <option>Re-opened</option>
                        <option>Closed</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </div>
                <div className=" zeroWidth">
            <div className=" ">

                    <button onClick={this.deleteItemConfirmation} className="editBtn nopadding">
                      Delete Item
                  </button>
                  </div>
                </div>
                {/* <input
              type="button"
              value="Delete"
              onClick={this.deleteItemConfirmation}
              ></input> */}
          </div>
        </div>

          </div>
         
        </div>
        {confirmationModal}
      </Auxiliary>
    );
  }
}


// export default connect(mapStateToProps, mapDispatchToProps)(Panel);
export default MainModal;