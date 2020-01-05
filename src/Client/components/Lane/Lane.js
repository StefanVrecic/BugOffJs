import React, { Component } from 'react';
import './Lane.css';
import LaneContents from './LaneContents';
import LaneTitle from './LaneTitle';
import Space from './Space';
import LaneAddCard from './LaneAddCard';


 class Lane extends Component {


    state = {
        columnNumber: -1
    }

    onDragOver(ev) {
        ev.preventDefault();
    }
    
    onDrop(ev, cat)  {
        
        let id = ev.dataTransfer.getData("id");

        // if (+draggedCardColumn[0] === this.state.columnNumber) {
        //     return alert("dragging and dropping to same col");
        // }

        // let TrelloBoard know to remove the card and put it in the other column
        this.props.transfer(id, this.state.columnNumber);
    
    }

    componentDidMount() {
        this.setState({ columnNumber: this.props.columnNumber })
    }

    addCard = (cardText) =>  {
        alert("inside lane.js!");
        this.props.addCardMethod(cardText, this.state.columnNumber);
    }

     render() {

        return (
            <div className= "box" 
            onDrop={(e)=>{this.onDrop(e, "wip")}}
            onDragOver={(e) => this.onDragOver(e)}>
            <LaneTitle color={this.props.color}>{this.props.title}</LaneTitle>
                <Space/>
    <LaneContents>  
        {this.props.children}
     </LaneContents>
     <LaneAddCard addCardMethod={this.addCard}></LaneAddCard>
        </div>
    );
}
};

export default Lane;





