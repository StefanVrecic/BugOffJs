import React, { Component } from 'react';
import './Modal.css'
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';


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
                            <span className="modalTitle-header">{this.props.title}</span>
                            <br></br>
                            <span className={`modalTitle-status 
                            titleColor-${this.props.color}`
                            }>({this.props.status})</span>
                        </div>
                        <div className = "modalTabOne">
                            Tab
                        </div>
                </div>
            </Auxiliary>
        );
        }
    }
export default Modal; 