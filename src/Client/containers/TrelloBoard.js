    import React, { Component } from 'react';
    import './TrelloBoard.css';
    import Card from '../components/Lane/Card';
    import Lane from '../components/Lane/Lane';
    import Modal from '../components/UI/Modal/Modal';
    import Axios from 'axios';


    class TrelloBoard extends Component {
        constructor(props) {
            super(props);
            this.child = React.createRef();
        }

        state = {
            cardModal: false,
            modalTitle: "default",
            modalStatus: "default",
            modalStatusNumber: -1,
            cards: [ [], [], [], [], []], // this should actually be lanes?
            lanes: [],
            testInit: false
            
        }

        setModalTitle = (name) => {
            this.setState({modalTitle : name});
        }

        setModalStatus = (status) => {
            this.setState({modalStatus : status})
        }

        closeModalHandler = () => {
            this.setState({cardModal : false}); 
        }

        cardClickedHandler = (name, col) => {
            this.setModalTitle(name);
            this.setModalStatus(this.titles[col]);
            this.setState({modalStatusNumber: col})

            this.openModalHandler();
        }

        openModalHandler = () => {
            this.setState({cardModal : true}); 
        }
        
        axiosConnect() {
                Axios.post("http://localhost:8080/users", {
    "name": "axiosTestName", "email": "axios@gmail.com", "password": "123123123"}
    ).then(function (response) { console.log(response);})
    .catch(function (error) {console.log(error.config.data);});}

        
        

        // columns_nodelist = document.querySelectorAll('.box');
        // columns = Array.from(columns_nodelist);
        titles = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];
        colors = ['open', 'progress', 'test', 'reopened', 'closed'];
        DROP_COLOUR = "#BFC0C2";
        


        

        componentDidMount() {
            this.initCards();
        }

        initCards() {
            
            if (!this.state.testInit) {
                let initCards = [ [], [], [], [], []];
                let initLanes = [];
                let i = 0;
                let n = 0;

            for (const t of this.titles) {
                n = 0;
                const keyName = i+"-"+n;
                const card = (<Card clicked = {this.cardClickedHandler}
                                    ref={this.child}
                                    keyID = {keyName}
                                    column={i} >Column {i} card</Card>);
                
                        initCards[i].push(card);

                
                const lane = (<Lane color={this.colors[i]} columnNumber={i} 
                    title = {t} transfer={this.transferCards}>
                             {card}
                </Lane>);
                initLanes.push(lane);
                i++;
                
            }

            this.setState({ cards: [...initCards] });
            this.setState({ lanes: [...initLanes] });
            this.setState({ testInit: true});
        }

        }



        transferCards = (dragStartColumn, dragStartIndex, dragDestinationColumn, name) =>  {
            
            

            const tempCards = [...this.state.cards];

            // const spliced
            tempCards[dragStartColumn].splice(dragStartIndex, 1);
            // now all the cards after this one will have the incorrect position so we will to have update them all
            // but then I don't have access to the rest of the data in the lane ater that... fuck!
            
            const keyName = dragDestinationColumn+"-"+(tempCards[dragDestinationColumn].length);

            const newCard = (<Card clicked = {this.cardClickedHandler}
                keyID = {keyName} ref={this.child} index={tempCards[dragDestinationColumn].length-1}
                column={dragDestinationColumn} name={name}>{name}</Card>);

           

            tempCards[dragDestinationColumn].push(newCard);

            // for (const c of tempCards[dragStartColumn]) {
            //     c.child.shiftDown();
            // }

            // alert("col: " + dragDestinationColumn + " | item: " + (tempCards[dragDestinationColumn].length-1) + 
            //     " | destCol: " + dragDestinationColumn);


            // spliced[0] needs to update its column index


            const tempLanes = [...this.state.lanes];

            const i = dragStartColumn;

            const originalLane = (<Lane color={this.colors[i]} columnNumber={i} 
                title = {this.titles[i]} transfer={this.transferCards}>
                         {tempCards[dragStartColumn]}
            </Lane>);

const d = dragDestinationColumn;

            const destinationLane = (<Lane color={this.colors[d]} columnNumber={d} 
                title = {this.titles[d]} transfer={this.transferCards}>
                        {tempCards[dragDestinationColumn]} 
            </Lane>);
            // problem 2 lines tempCards[..]..
            
            alert(tempCards[2].length);
            tempLanes[dragStartColumn] = originalLane;
            tempLanes[dragDestinationColumn] = destinationLane;

            this.setState( { cards: tempCards });
            this.setState( { lanes: tempLanes });

            // alert(array.length + " nuber of columns");
            
        }

     

        render () {

         
        //    alert(this.state.cards[0] + " /// " + this.state.cards[1] + " /// " + this.state.cards[2] + " /// " +
        //    this.state.cards[3] + " /// " + this.state.cards[4] + " /// " );

            
            return (

                    <div className="wrapper">
                        {this.state.lanes}
                <Modal 
                show = {this.state.cardModal} modalClosed = {this.closeModalHandler} 
                status={this.state.modalStatus} title={this.state.modalTitle}
                color={this.state.modalStatusNumber} >
                </Modal>

    

    </div>
            );
        }
    }

    export default TrelloBoard;

