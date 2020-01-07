import React, { Component } from 'react';
import './Modal.css'
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import '../../../../bootstrap.css';
import Calendar from 'react-calendar';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
            startDate: new Date()
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

      setEditing = () => {
            // state = editing => button value = "save" => user wants to save description  
        if (this.state.editing) {
            this.props.addDescription(this.state.descriptionArea);
          }
        this.setState({ descriptionArea: this.props.data[3] })
        this.setState({ editing: !this.state.editing })
      }
    
      closeModal = () =>  {
        this.props.modalClosed();
        this.setState({ closed: true, cardText: "", editing: false, descriptionArea: ""});
      }

    //   onCalendarChange = date => this.setState({ date })
      onCalendarChange = date => alert(date);

    render()  {
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
                    className = "Modal"
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
                                className="calendarComponent"
                                timeIntervals={15}
                                selected={this.state.startDate}
                                onChange={this.handleCalendarChange}
                                showTimeSelect
                        />

                        



                </div>
            </Auxiliary>
        );
        }
    }
export default MainModal; 