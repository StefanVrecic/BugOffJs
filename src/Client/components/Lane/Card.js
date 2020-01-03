import React, { Component } from 'react';
import './Card.css';



class Card extends Component {
    state = {
        column: 2,
        index: -1,
        name: "default"
    }

    componentDidMount() {
        this.setState({column: this.props.column});
        this.setState({title: this.props.children});
        this.setState({index: this.props.index});
        this.setState({name: this.props.name});
    }
    
    onDragEnd = (ev) => {
        ev.preventDefault();
    }
    
    onDragStart = (ev, id) => {
        console.log('dragstart:',id);
        ev.dataTransfer.setData("id", id);
        ev.dataTransfer.setData("name", this.props.children);
    }

    updateIndex(newIndex) {
        this.setState({ index: newIndex });
    }

    shiftDown() {
        // alert("index " + this.state.index + " name \n" + this.props.name);
        // this.setState({ index: this.state.index - 1});
        // alert("index " + this.state.index + " name \n" + this.props.name);
    }

    updateColumn(newColumn) {
        this.setState({ column: newColumn });
    }

    setTitle() {
        this.setState({ title: this.props.children})
    }

    
    render() {
            
            return (
            <div 
            key = {this.props.keyID}
            className="box-contents--card droppable" 
            draggable="true" 
            onClick = {() => this.props.clicked(this.props.children, this.state.column) }
            onDragStart = {(e) => this.onDragStart(e, this.props.keyID)}
                onDragEnd = {(e) => this.onDragEnd(e)}
            >
        {this.props.children}
       </div>
    );
}
};

export default Card;