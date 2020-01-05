import React, { Component } from "react";

import axios from "axios";

class Auth extends Component {

  componentDidMount() {
    this.db_login("vstefan@hotmail.co.uk", "vstefan");
  }

  handleLoginSuccess() {
    this.props.history.push( '/panel' );
  }

  handleLoginFail() {
      this.props.history.goBack();
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
      })
      .then(() => {
          this.handleLoginSuccess();
        })
        .catch(() => {
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
