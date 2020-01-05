import React, { Component } from 'react';
import './LaneAddCard.css';
import Button from '../UI/Button/Button';
import  '../UI/Button/Button.css';

class LaneAddCard extends Component {
    

    constructor(props) {
		super(props);
		this.state = {
            closed: false,
            cardText: ""
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
      }

      submitCard = () =>  {
          alert(this.state.cardText);
      }

      handleInputChange(event)  {
		const target = event.target;
		const value = target.value;
		const name = target.name;
	
		this.setState({
		  [name]: value
		});
      }
      
      handleSubmit(event) {
          alert(event.target.value)
      }

render() {
    // write out text area. If focused = expand. If not = shut. May need to use refs for that not sure.
    let burger;
    if (this.state.closed) {
        burger = (<p>Add another card</p>);
    } else {
        // add Card + close
        burger = (
            <div className = "newCard">
                    
                    <textarea 
                    className="textStyle" placeholder ="Write title for bug" maxlength="87"
                    cols="30" rows="3" wrap="soft" name="cardText"
                    onChange={this.handleInputChange} value={this.state.cardText}>
                            </textarea>

                    <div className = "submitCancel" >

                        <Button className="btnLeft" btnType="addBtn Success-bg" clicked={this.submitCard}>
                            Add card
                        </Button>
                        <span class="close">x</span>
                    </div>
            </div>
        );
    }
    return (
            <div className = "addCard">
                {burger}
            </div>
    );

}

}

export default LaneAddCard;