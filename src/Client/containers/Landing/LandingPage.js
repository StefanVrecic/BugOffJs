import React, { Component } from 'react';
import logo from './images/bugzilla.png';

import './css/util.css';
import './css/main.css';
import './css/shake.css'

import '../../../bootstrap.css';
import axios from "axios";
// const port = process.env.PORT;
// const port = "http://localhost:8080"
const port = "https://vrecic-bugoff-api.herokuapp.com";

// I was going to split this into two components LandingPage and Auth
// I originally did that, but there was a UX weakness which I attempted to resolve
// I couldn't figure it out so I just put everything in one file
// I figured out what was going wrong, but there's not much reason to split it now, will do later if I have time

class LandingPage extends Component {

	constructor(props) {
		super(props);	
		this.myRef = React.createRef();
		this.state = {
		  isGoing: true,
		  numberOfGuests: 2
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
	  }

	  componentDidMount() {
		  this.db_confirmIdentity();
	  }
	
	
	state = {
		newUser: false,
		rememberMe: false,
		email: null,
		pass: null,
		passConfirm: null,
		shake: false
	}

	shakeVerify() {

	}

	signUp = (e) =>  {
		e.preventDefault();
		
		if (this.state.newUser && this.state.pass !== this.state.passConfirm) {
			// show some message or shake 
			return;
		}

		if (this.state.newUser) {
			this.db_createUser(this.state.email, this.state.pass);
		} else {
			
			this.db_login(this.state.email, this.state.pass);
			// this.db_login(this.props.history.location.state.email, this.props.history.location.state.pass);
		}
		// this.props.history.push( '/auth' , { email: this.state.email, 
		// 		pass: this.state.pass, newUser: this.state.newUser});

		// not sure if this works?
		// this.setState({email:null, pass:null});
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
	let emailClasses = "input100";
	if (this.state.shake === "right") {
		emailClasses = "input100 emailShakeRight"
	} else if (this.state.shake === "left") {
		emailClasses = "input100 emailShakeLeft"
	}
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
					{/* <span className="login100-form-title brandname p-b-43">Bug Squash</span>	 */}
					<h1 className="squashTitle">
						Bug Squash
					</h1>
					<span className="login100-form-title p-b-43">
						Login to continue
					</span>
						

{/* "input100" */}
					<div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz" >
						<input className={emailClasses} type="text" name="email" value={this.state.email}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Email</span>
					</div>
					
					
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className={emailClasses} type="password" name="pass" value={this.state.pass}
								onChange={this.handleInputChange}/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>
							{verifyPassword}

					<div className="flex-sb-m w-full p-t-3 p-b-32">
						{/* <div className="contact100-form-checkbox">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" onChange={ this.rememberCheck } />
							<label className="label-checkbox100" for="ckb1">
								Remember me
							</label>
						
						</div> */}
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

  // todo
  db_checkUserExists = (user) => {}

  // logic could be merged with below, may reduce managability though
  db_createUser = (user, userPassword) => {
    axios.post(port+"/users", {
        email: user,
        password: userPassword
      })
      .then(function(response) {
        console.log("success login - call loadCards()");
        // need to store this token
        window.localStorage.setItem("login-token", response.data.token);
      })
      .then(() => {
          this.handleLoginSuccess();
        }).catch((error) => {
        console.log("fail login");
		// console.log(error.config.data);
        this.handleLoginFail();
      });
  }

  db_login = (user, userPassword) =>  {
    axios.post(port + "/users/login", {
        email: user,
        password: userPassword
      })
      .then(function(response) {
        console.log("success login - call loadCards()");
        // need to store this token
        window.localStorage.setItem("login-token", response.data.token);
        window.localStorage.setItem("email", user);
      })
      .then(() => {
          this.handleLoginSuccess();
        }).catch(() => {
        console.log("fail login");
        // console.log(error.config.data);
        this.handleLoginFail();
      });
  }

  handleLoginSuccess() {
	  
	//   set auth context here.
    this.props.history.push( '/panel' );
  }

  handleLoginFail() {
	  // kind of hacky and suboptimal and not accessiibility friendly
	this.setState({ shake: "right"});
	setTimeout(() => { this.setState({shake:"left"})}, 100);
	setTimeout(() => { this.setState({shake:"zero"})}, 200);
  }

  db_confirmIdentity = () => {

	const instance = axios.create({
		baseURL: port,
		headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
	});
	
	instance.post("/users/checkauth", {
	}).then(response => {
		this.handleLoginSuccess();
	})
	.catch(error => {
		// alert("failed to auto login");
	});
}
  
}

export default LandingPage;