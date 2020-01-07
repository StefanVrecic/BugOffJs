import React, { Component } from "react";

import axios from "axios";

class Auth extends Component {

  componentDidMount() {
      if (this.props.history.location.state.newUser) {
          
          
          // need to run a bit of logic here to see if user alreadys exists, instead of rendering a different page
          // like I have done here - just render a little message saying that user already exists
          // also need to make a 'confirm password' type thing
        // email confirmation wouldn't be a bad idea either...s
        
        this.db_createUser(this.props.history.location.state.email, this.props.history.location.state.pass);
        
    } else {
        
        this.db_login(this.props.history.location.state.email, this.props.history.location.state.pass);
        // this.db_login("soprano@hotmail.com", "soprano");
    }
  }

  handleLoginSuccess() {
    //   set auth context here.
    this.props.history.push( '/panel' );
  }

  handleLoginFail() {
    //   alert("fail");
      this.props.history.goBack();
  }

  // todo
  db_checkUserExists = (user) => {}

  // logic could be merged with below, may reduce managability though
  db_createUser = (user, userPassword) => {
    axios.post("http://localhost:8080/users", {
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
        }).catch(() => {
        console.log("fail login");
        // console.log(error.config.data);
        this.handleLoginFail();
      });
  }

  db_login = (user, userPassword) =>  {
    axios.post("http://localhost:8080/users/login", {
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

  render() {
    return (
        <div>Loading...</div>
    );
  }
}

export default Auth;
