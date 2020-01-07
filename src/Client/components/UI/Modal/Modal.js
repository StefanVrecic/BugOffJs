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
                    className = {this.props.classes}
                    style = {{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)', 
                        opacity: this.props.show ? '1' : '0'
                    }}>
                        <p>
                            {this.props.children}
                        </p>

                </div>
            </Auxiliary>
        );
        }
    }
export default Modal; 