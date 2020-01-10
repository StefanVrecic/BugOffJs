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
      deleteItemModal: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
      bugProperties = ["id", "name", "status", "description", "dueDate", "severity", "overdueConfirmed",
        "activity", "bugReproducible"];
        
        p = title => {
          return this.bugProperties.indexOf(title);
      }
  handleCalendarChange = date => {
    this.setState({
      startDate: date
    });

    this.props.addDate(date);
  };

  confirmDeleteItem = () => {
    // alert("confirmed")
    this.setState({deleteItemModal: false});
    this.props.deleteItemModal();
  }
  rejectDeleteItem = () => {
    this.setState({deleteItemModal: false});
  }
  deleteItemConfirmation = () => {
    alert("deleteItem?");
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
    if (this.props.data.length > 0 && this.state.option === "empty") {
      this.setState({option: this.props.status});
    }
    if (this.props.data.length > 0 && this.state.sever === "empty") {
      this.setState({sever: this.props.data[5]});
    }
    if (this.props.data.length > 0 && this.state.reprod === "empty") {
      this.setState({reprod: this.props.data[8]});
    }
  }

  escFunction = (event) => {
    if(this.state.closed === true && event.keyCode === 27) {
      this.closeModal();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
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
    this.setState({disableCalendar: !this.state.disableCalendar});
  }

  closeModal = () => {
    this.props.modalClosed();
    // reset properties for next modal
    this.setState({
      closed: true,
      cardText: "",
      editing: false,
      descriptionArea: "",
      option: "empty",
      reprod: "empty",
      sever: "empty "
    });
    this.setState({ date: "", startDate: new Date(), severity: "" });
  };
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
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
    
    
    let editOrSave = "Edit";
    
    let displayEditing = <p>{this.props.data[3]}</p>;

    if (this.state.editing) {
      editOrSave = "Save";
      displayEditing = (
        <div>
          <textarea
            className="textStyle"
            placeholder="Add a more detailed description"
            maxlength="1000"
            cols="75"
            rows="12"
            wrap="soft"
            name="descriptionArea"
            onChange={this.handleInputChange}
            value={this.state.descriptionArea}
          ></textarea>
        </div>
      );
    }
    let displayCalendar = "";
    let onOffButton = "Off";
    if (this.state.disableCalendar) {
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
              <b>{this.props.title}</b>
            </span>
            <br></br>
            <span
              className={`modalTitle-status 
                            titleColor-${this.props.color}`}
            >
              ({this.props.status})
            </span>
          </div>

          <input type="button" className="btn-success" value={editOrSave} onClick={this.setEditing}></input>
          {displayEditing}

          <br></br>
          <br></br>
        <div className = "bugSettings">
          <div className="date-Reminder">
            <div>
             {displayCalendar}

              <input
              type="button" value={onOffButton} onClick={this.toggleCalendar} className="disableDate"
              ></input>

            </div>  
            <div>
							<input className="input-checkbox100" id="ckb2" type="checkbox" name="sign-up" onChange = { this.newUserCheck }/>
							<label className="label-checkbox100" for="ckb2">
              Email me </label>
                <input type="number" min="1" max="48" step="1" />
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
                <div className="container-login50-form-btn mainModalBtn-spacing">
                    <button onClick={this.addNewNote} className="login100-form-btn">
                      Add
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
                <div className="container-login50-form-btn mainModalBtn-spacing">
                    <button disabled={viewNotesDisabled} onClick={this.props.viewNotes} className="login100-form-btn ">
                      View notes
                  </button>
                </div>
              </div>
          </div>

          <div className="notesTextAreaContainer">
            <textarea
              className="notesTextArea"
              placeholder="Add a new note (250 characters max)"
              maxlength="250"
              cols="45"
              rows="5"
              wrap="soft"
              name="noteArea"
              onChange={this.handleInputChange}
              value={this.state.noteArea}
              ></textarea>
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
                <input
              type="button"
              value="Delete"
              onClick={this.deleteItemConfirmation}
              ></input>
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