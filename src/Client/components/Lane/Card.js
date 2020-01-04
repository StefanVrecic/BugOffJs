import React, { Component } from 'react';
import './Card.css';
import ReactDOM from 'react-dom';


class Card extends Component {
    state = {
        uniqueID: "default"
    }

    componentDidMount() {
        this.setState({uniqueID: this.props.uniqueID});
    }
    

    onDragEnd = (ev) => {
        ev.preventDefault();
    }
    
    onDragStart = (ev, id) => {
        console.log("dragstart: " + id);
        ev.dataTransfer.setData("id", id);
        ev.dataTransfer.setData("name", this.props.children);
    }

    // cardClicked = (id) => {}
    
    render() {
            return (
            <div 
            uniqueID = {this.props.uniqueID}
            className="box-contents--card droppable" 
            draggable="true" 
            onClick = {() => this.props.clicked(this.props.uniqueID) }
            onDragStart = {(e) => this.onDragStart(e, this.props.uniqueID)}
            onDragEnd = {(e) => this.onDragEnd(e)}
            >
        {this.props.children}
       </div>
    );
}
};

export default Card;