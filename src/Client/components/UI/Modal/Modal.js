import React, { Component } from 'react';
import './Modal.css'
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import '../../../../bootstrap.css';


class Modal extends Component {

shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.show !== this.props.show || nextProps.children !== this.props.children) {
            return true;
        }
    }

    

    render()  {
        return (
            <Auxiliary>
                <Backdrop show = {this.props.show} clicked = { this.props.modalClosed } />
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
                        <div className = "modalTabOne">
                            {/* <input type="button" value="Delete" onClick={this.props.deleteItemModal}></input>
                            <input type="button" value="Deadline" ></input>
                            <input type="button" value="Edit card" ></input>
                            <input type="button" value="Description" ></input> */}
                        </div>
                        <textarea 
                    className="textStyle" placeholder ="Add a more detailed description" maxlength="500"
                    cols="75" rows="6" wrap="soft" name="cardText"
                    // onChange={this.handleInputChange} value={this.state.cardText}
                    >
                            </textarea>

                </div>
            </Auxiliary>
        );
        }
    }
export default Modal; 