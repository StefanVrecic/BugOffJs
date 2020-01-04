import React, { Component } from 'react';
import './Card.css';
import ReactDOM from 'react-dom';


class Card extends Component {
    state = {
        uniqueid: "default"
    }

    componentDidMount() {
        this.setState({uniqueid: this.props.uniqueid});
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
            uniqueid = {this.props.uniqueid}
            className="box-contents--card droppable" 
            draggable="true" 
            onClick = {() => this.props.clicked(this.props.uniqueid) }
            onDragStart = {(e) => this.onDragStart(e, this.props.uniqueid)}
            onDragEnd = {(e) => this.onDragEnd(e)}
            >
        {this.props.children}
       </div>
    );
}
};

export default Card;