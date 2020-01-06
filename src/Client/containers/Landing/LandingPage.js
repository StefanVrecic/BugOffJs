import React, { Component } from 'react';
import logo from './images/bugzilla.png';
import {  Route, Redirect } from "react-router-dom";
// import './vendor/bootstrap/css/bootstrap.min.css'
// import './fonts/font-awesome-4.7.0/css/font-awesome.min.css'
// dimport './fonts/Linearicons-Free-v1.0.0/icon-font.min.css'
// import './vendor/animate/animate.css'
// import './vendor/css-hamburgers/hamburgers.min.css'
// import './vendor/animsition/css/animsition.min.css'
// import './vendor/select2/select2.min.css'
// import './vendor/daterangepicker/daterangepicker.css'
import './css/util.css'
import './css/main.css'
import { verify } from 'jsonwebtoken';

class LandingPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  isGoing: true,
		  numberOfGuests: 2
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
	  }
	
	
	state = {
		newUser: false,
		rememberMe: false,
		email: null,
		pass: null,
		passConfirm: null
	}

	shakeVerify() {

	}

	signUp = (e) =>  {
		e.preventDefault();
		
		if (this.state.newUser && this.state.pass !== this.state.passConfirm) {
			// show some message or shake 
			return;
		}

		this.props.history.push( '/auth' , { email: this.state.email, 
				pass: this.state.pass, newUser: this.state.newUser});

		// not sure if this works?
		this.setState({email:null, pass:null});
	}

	handleInputChange(event)  {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
	
		this.setState({
		  [name]: value
		});
	  }

	rememberCheck = () =>  {
		this.setState({rememberMe: !this.state.rememberMe});
	}
	newUserCheck = () =>  {
		this.setState({newUser: !this.state.newUser});
	}

render() {
	let verifyPassword = null;
	if ( this.state.newUser) {

		verifyPassword = (
			<div className="wrap-input100 validate-input" data-validate="Password is required">
								<input className="input100" type="password" name="passConfirm" value={this.state.passConfirm}
										onChange={this.handleInputChange}/>
								<span className="focus-input100"></span>
								<span className="label-input100">Verify password</span>
							</div>
	);
}
	return (

	
<div>
	
	<div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">

			<form className="login100-form validate-form">
					<span className="login100-form-title brandname p-b-43">Bug Squash</span>	
					<span className="login100-form-title p-b-43">
						Login to continue
					</span>
						


					<div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz" >
						<input className="input100" type="text" name="email" value={this.state.email}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Email</span>
					</div>
					
					
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className="input100" type="password" name="pass" value={this.state.pass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>
							{verifyPassword}

					<div className="flex-sb-m w-full p-t-3 p-b-32">
						<div className="contact100-form-checkbox">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" onChange={ this.rememberCheck } />
							<label className="label-checkbox100" for="ckb1">
								Remember me
							</label>
						
						</div>
						<div>
							<input className="input-checkbox100" id="ckb2" type="checkbox" name="sign-up" onChange = { this.newUserCheck }/>
							<label className="label-checkbox100" for="ckb2">
								New user
							</label>
						</div>
						<div>
							{/* <a href="#" className="txt1">
								Forgot Password?
							</a> */}
						</div>
					</div>
			

					<div className="container-login100-form-btn">
						<button onClick = {this.signUp} className="login100-form-btn">
							Login
						</button>
					</div>
					
				

				</form>

				<div className="login100-more" >
					<img src={logo}/>
				</div>


				{/* <div className="login100-more" style="background-image: url('images/bugzilla.png');"></div> */}
			</div>
		</div>
	</div>
</div>

);
}
}

export default LandingPage;