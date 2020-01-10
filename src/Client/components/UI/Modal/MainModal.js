import React, { Component } from "react";
import "./Modal.css";
import Auxiliary from "../../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import "../../../../bootstrap.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Form from "react-bootstrap/Form";

import "./MainModal.css";

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
      option: "empty"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleCalendarChange = date => {
    this.setState({
      startDate: date
    });

    this.props.addDate(date);
  };

  saveSeverity = (event) => {
    this.props.addSeverity(event.target.value);
  }
  saveReproducible = (event) => {
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
  }

  componentDidMount() {
 
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
      option: "empty"
    });
    this.setState({ date: "", startDate: new Date(), severity: "" });
  };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    

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
                      <Form.Control onChange={this.saveReproducible} size="sm" as="select">
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
                      <Form.Control onChange={this.saveSeverity} size="sm" as="select">
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
              onClick={this.props.deleteItemModal}
              ></input>
          </div>
        </div>

          </div>
         
        </div>
      </Auxiliary>
    );
  }
}


// export default connect(mapStateToProps, mapDispatchToProps)(Panel);
export default MainModal;