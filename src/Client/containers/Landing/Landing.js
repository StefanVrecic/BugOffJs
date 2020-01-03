import React, { Component } from 'react';
import Welcome from './Welcome';
import Login from './Login';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';


class Landing extends Component {
    render() {
        return (
            <Auxiliary>
                <Welcome></Welcome>
                <Login></Login>
            </Auxiliary>
        );
    }
}

export default Landing;