import React, { Component } from 'react';
import Modal from './Modal';
import "./AccountModal.css";

class AccountModal extends Component {

    constructor(props) {
		super(props);
		this.state = {
            open: true,
            currentPass: "",
            newPass: "",
            passConfirm: ""
		};
		this.handleInputChange = this.handleInputChange.bind(this);
      }
      
      componentDidUpdate() {
        if(this.state.open === false) {
            this.props.closeModal(); // see [Modal.js]
        }
    }

    handleInputChange(event)  {
		const target = event.target;
		const value = target.value;
		const name = target.name;
	
		this.setState({
		  [name]: value
		});
      }
      
    closeModalHandler = () => {
        this.setState({open: false});
        this.props.closeModal();
    }

    signUp = () => {
        if (this.state.newPass !== this.state.passConfirm) {
            return; // warning message should be intiated actually
        }
        alert(this.state.currentPass);
        this.props.changePass(this.state.currentPass, this.state.newPass);
    }

render() {
    return (
            <Modal show={this.state.open}
            modalClosed={this.closeModalHandler}
            classes="Modal defaultDimensions">
                <h1 className="heading-margin">Change password</h1>
                
                <div className = "changePassForm">

					<div className="wrap-input50 validate-input input-margin" data-validate = "Password is required" >
						<input className="input100" type="password" name="currentPass" value={this.state.currentPass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Current Password</span>
					</div>
                    
					
					
					<div className="wrap-input50 validate-input input-margin" data-validate="Password is required">
						<input className="input100" type="password" name="newPass" value={this.state.newPass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">New Password</span>
					</div>
                    
                      <div className="wrap-input50 validate-input input-margin" data-validate="Password is required">
                        <input className="input100" type="password" name="passConfirm" value={this.state.passConfirm}
                                onChange={this.handleInputChange}/>
                        <span className="focus-input100"></span>
                        <span className="label-input100">Verify password</span>
                    </div>
                    <br></br>


					<div className="container-login50-form-btn">
						<button onClick = {this.signUp} className="login100-form-btn">
							Confirm
						</button>
					</div>
					</div>
				

      
            </Modal>
    );

}

}

export default AccountModal;
