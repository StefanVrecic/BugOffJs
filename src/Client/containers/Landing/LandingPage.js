import logo from './images/bugzilla.png';
import './vendor/bootstrap/css/bootstrap.min.css'
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import './fonts/Linearicons-Free-v1.0.0/icon-font.min.css'
import './vendor/animate/animate.css'
import './vendor/css-hamburgers/hamburgers.min.css'
import './vendor/animsition/css/animsition.min.css'
import './vendor/select2/select2.min.css'
import './vendor/daterangepicker/daterangepicker.css'
import './css/util.css'
import './css/main.css'
import React, { Component } from 'react';

class LandingPage extends Component {

render() {
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
						<input className="input100" type="text" name="email"/>
						<span className="focus-input100"></span>
						<span className="label-input100">Email</span>
					</div>
					
					
					<div className="wrap-input100 validate-input" data-validate="Password is required">
						<input className="input100" type="password" name="pass"/>
						<span className="focus-input100"></span>
						<span className="label-input100">Password</span>
					</div>
					<div className="flex-sb-m w-full p-t-3 p-b-32">
						<div className="contact100-form-checkbox">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
							<label className="label-checkbox100" for="ckb1">
								Remember me
							</label>
						
						</div>
						<div>
							<input className="input-checkbox100" id="ckb2" type="checkbox" name="sign-up"/>
							<label className="label-checkbox100" for="ckb2">
								New user
							</label>
						</div>
						<div>
							<a href="#" className="txt1">
								Forgot Password?
							</a>
						</div>
					</div>
			

					<div className="container-login100-form-btn">
						<button className="login100-form-btn">
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