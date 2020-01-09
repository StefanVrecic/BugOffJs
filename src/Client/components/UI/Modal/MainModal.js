import React, { Component } from 'react';
import './Modal.css'
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import '../../../../bootstrap.css';
import Calendar from 'react-calendar';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dropdown from 'react-bootstrap/Dropdown';

import DropdownButton from 'react-bootstrap/DropdownButton';

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
            addNote: ""
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
      }

      handleCalendarChange = date => {
        this.setState({
          startDate: date
        });

        this.props.addDate(date);
      };
    
      componentDidUpdate() {
        //   alert(this.props.data);
      }

    handleInputChange(event)  {
		const target = event.target;
		const value = target.value;
        const name = target.name;
        
		this.setState({
		  [name]: value
		});
      }

      setSeverity = (eventKey) =>  {
        //   alert(eventKey);
          this.setState({severity: eventKey});
        //   alert(typeof eventKey);
          this.props.addSeverity(eventKey);
      }

      addNewNote = () => {
        const note = this.state.addNote;
        this.props.postNewNote(note);
      }

      setEditing = () => {
            // state = editing => button value = "save" => user wants to save description  
        if (this.state.editing) {
            this.props.addDescription(this.state.descriptionArea);
          }
        this.setState({ descriptionArea: this.props.data[3] })
        this.setState({ editing: !this.state.editing })
      }
    
    //   closed: true,
    //   cardText: "",
    //   editing: false,
    //   descriptionArea: "",
    //   date: "",
    //   startDate: new Date(),
    //   severity: ""

      closeModal = () =>  {
        this.props.modalClosed();
        // reset properties for next modal
        this.setState({ closed: true, cardText: "", editing: false, descriptionArea: ""});
        this.setState({ date: "", startDate: new Date(), severity: ""});
      }

    
    render()  {
        // alert(this.props.data[4]);
        let startingDate = new Date();
        if (this.props.data[4] != undefined) {
            startingDate = new Date(this.props.data[4]);
        }
        

        let editOrSave = "Edit";
        // alert();
        let displayEditing = 
        (
            <p>{this.props.data[3]}</p>
            );
            
            if (this.state.editing) {
                 editOrSave = "Save";
            displayEditing = (
                <div>

                <textarea className="textStyle" placeholder ="Add a more detailed description" maxlength="500"
                    cols="75" rows="12" wrap="soft" name="descriptionArea"
                    onChange={this.handleInputChange} value={this.state.descriptionArea} >
                            </textarea>
                    </div>
            );
        }

        return (
            <Auxiliary>
                <Backdrop show = {this.props.show} clicked = { this.closeModal} />
                <div 
                    className = "Modal defaultDimensions"
                    style = {{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)', 
                        opacity: this.props.show ? '1' : '0'
                    }}>
                        <div className = "modalTitle">
                            <span className="modalTitle-header"><b>{this.props.title}</b></span>
                            <br></br>
                            <span className={`modalTitle-status 
                            titleColor-${this.props.color}`
                            }>({this.props.status})</span>
                        </div>
                        
                        <input type="button" className="btn-success" value={editOrSave} onClick={this.setEditing}></input>
                            {displayEditing}
                            <input type="button" value="Delete" onClick={this.props.deleteItemModal}></input>

                            {/* <div>
                                <Calendar
                                onChange={this.onCalendarChange}
                                value={this.state.date}
                                />
                            </div> */}

                            <DatePicker
                                // selected={this.props.data[4]}
                                className="calendarComponent"
                                timeIntervals={15}
                                selected={startingDate}
                                onChange={this.handleCalendarChange}
                                showTimeSelect
                        />
                        
                        <div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className="input100" type="text" name="addNote" value={this.state.addNote}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Add new note</span>
					</div>

          

          <div className="container-login100-form-btn">
						<button onClick = {this.addNewNote} className="login100-form-btn">
							Add new note
						</button>
					</div>
          <input type="button" value="View notes" onClick={this.props.viewNotes}></input>

<div>

<Dropdown onSelect={this.setSeverity}>
  <Dropdown.Toggle variant="success" id="dropdown-basic" drop="up">
    Dropdown Button
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item eventKey="High">High</Dropdown.Item>
    <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
    <Dropdown.Item eventKey="Low">Low</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
</div>
                        



                </div>
            </Auxiliary>
        );
        }
    }
export default MainModal; 