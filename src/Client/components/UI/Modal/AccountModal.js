import React, { Component } from 'react';
import Modal from './Modal';

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
                AccountModal
                
                
		
					<span className="login100-form-title p-b-43">
						Login to continue
					</span>
						


					<div className="wrap-input100 validate-input" data-validate = "Password is required" >
						<input className="input100" type="password" name="currentPass" value={this.state.currentPass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Current Password</span>
					</div>
					
					
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className="input100" type="password" name="newPass" value={this.state.newPass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>
                    
                      <div className="wrap-input100 validate-input" data-validate="Password is required">
                        <input className="input100" type="password" name="passConfirm" value={this.state.passConfirm}
                                onChange={this.handleInputChange}/>
                        <span className="focus-input100"></span>
                        <span className="label-input100">Verify password</span>
                    </div>



					<div className="container-login100-form-btn">
						<button onClick = {this.signUp} className="login100-form-btn">
							Confirm password change
						</button>
					</div>
					
				

      
            </Modal>
    );

}

}

export default AccountModal;

{/* <form>
<label>
    Current pass:
    <input type="text" name="Current" />
</label>
<label>
    New Password:
    <input type="text" name="New" />
</label>
<label>
   Verify New Password:
    <input type="text" name="Verify" />
</label>
<input type="submit" value="Submit" onSubmit={this.submit} />
</form> */}