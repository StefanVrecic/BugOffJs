import React, { Component } from 'react';
import './LaneAddCard.css';
import Button from '../UI/Button/Button';
import  '../UI/Button/Button.css';
import './LaneAddCard.css';

class LaneAddCard extends Component {
    

    constructor(props) {
		super(props);
		this.state = {
            closed: true,
            cardText: ""
		};
	
		this.handleInputChange = this.handleInputChange.bind(this);
      }

      submitCard = () =>  {
          const cardText = this.state.cardText;
          if (cardText === "") {
              return;
          }
          this.setState({ cardText: ""});

          this.addCard(cardText);
      }
      
      addCard(cardText) {
        this.props.addCardMethod(cardText);
   
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
        //   alert(event.target.value)
      }
      toggleAddCard = () =>  {
          this.setState({ closed: !this.state.closed});
      }

render() {
    // write out text area. If focused = expand. If not = shut. May need to use refs for that not sure.
    let burger;
    if (this.state.closed) {
        burger = (<p className="addCardButton" onClick={this.toggleAddCard}>
            <span className="plus">+ </span>Add another card</p>);
    } else {
        // add Card + close
        burger = (
            <div className = "newCard">
                    
                    <textarea 
                    className="textStyle" placeholder ="Enter title for bug" maxlength="81"
                    cols="30" rows="3" wrap="soft" name="cardText"
                    onChange={this.handleInputChange} value={this.state.cardText}>
                            </textarea>

                    <div className = "submitCancel" >
                        <div className="addBtn" >
                        <Button btnType="btn-success" clicked={this.submitCard}>
                            Add card
                        </Button>
                    </div>
                        <div className="closeAddCardPadding">
                        <span class="closeAddCard" onClick={this.toggleAddCard}>x</span>
                        </div>
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