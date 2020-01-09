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

      componentDidMount() {
          this.setState({ closed: !this.props.defaultOpen})
        }
        
        componentDidUpdate() {
      }

      submitCard = () =>  {
          let cardText = this.state.cardText;
          if (cardText === "") {
              return;
          }
          this.setState({ cardText: ""});

//           let i = 0; const addSpaces = [];
//           for (var x = 0; x < cardText.length; x++) {
//             var c = cardText.charAt(x); //Add code here to do the translation
//             if (c === ' ') {
//                 i=0;
//             }
//             if (i>22) {
//                 // add space
//                 addSpaces.push(x);
//                 i = 0;
//             }
//             i++;
// }       
//             // 25 50 75
//         for (var x = 0; x<addSpaces.length; x++) {
//             if (x===0) {                  // 0 - 24(25) + '25' + 25-75
//                 cardText = cardText.substring(0, addSpaces[x]) + '-' + cardText.substring(addSpaces[x], cardText.length);
//             } else {                    // 
//                 cardText = cardText.substring(0, addSpaces[x]+x) + '-' + cardText.substring(addSpaces[x]+x, cardText.length);
//             }
            
//         }
        
//         alert(cardText);
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
          this.props.addingCard_card();
      }

render() {
    // write out text area. If focused = expand. If not = shut. May need to use refs for that not sure.
    let burger;
    if (this.state.closed || !this.props.defaultOpen) {
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