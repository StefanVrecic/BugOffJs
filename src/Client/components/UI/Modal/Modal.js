import React, { Component } from 'react';
import './Modal.css'
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import '../../../../bootstrap.css';

    // Put this code in componentDidUpdate() in the higher Modal

    // if(this.state.open === false) {
    //     this.props.closeModal();
    // }

    // if the 'escape' key is pressed, Modal will attempt unmount and remove the keylistener
    // removing the keylistener will trigger a componentUpdate in the <...>Modal
    // this will cause a re-render in this <...>Modal, causing a re-render in [Modal.js]
    // thus neither components will unmount, they will merely disappear
    // thus it is necessary to check if !this.state.open on update because if escape key is pressed
    // this will ensure the this <...>Modal is closed before any re-renders can occur
    // -- the alternative would be to comment out document.removeKeyListener(...) in 
    // the componentDidUnmount(). I consider the alternative poorer practice.




class Modal extends Component {

    constructor(props){
        super(props);
        this.escFunction = this.escFunction.bind(this);
      }

      escFunction(event){
        if(event.keyCode === 27) {
            document.removeEventListener("keydown", this.escFunction, false);
          this.props.modalClosed();
          
        }
      }

      componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
      }
      
      componentWillUnmount(){
        // document.removeEventListener("keydown", this.escFunction, false);
      }

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