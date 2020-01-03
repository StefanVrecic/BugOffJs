import React, { Component } from 'react';
import './Card.css';



class Card extends Component {
    state = {
        column: 2
    }
    componentDidMount() {
        this.setState({column: this.props.column});
    }
    
    render() {

        return (
            <div className="box-contents--card droppable" draggable="true" 
            onClick = {() => this.props.clicked(this.props.children, this.state.column) }>
        {this.props.children}
       </div>
    );
}
};

export default Card;