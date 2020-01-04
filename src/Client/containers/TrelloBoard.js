    import React, { Component } from 'react';
    import './TrelloBoard.css';
    import Card from '../components/Lane/Card';
    import Lane from '../components/Lane/Lane';
    import Modal from '../components/UI/Modal/Modal';
    import Axios from 'axios';
    // import { connect } from 'react-redux';
    import uniqid from 'uniqid';
    class TrelloBoard extends Component {
        constructor(props) {
            super(props);
            this.child = React.createRef();
        }
        
        initNames = ['Stacey', 'Jessie', 'Maddie', 'Katie', 'Danielle'];
        state = {
            cardModal: false,
            modalTitle: "default",
            modalStatus: "default",
            modalStatusNumber: -1,
            cards: [ [], [], [], [], []], // this should actually be lanes?
            lanes: [],
            testInit: false,
            idArray: [],
            dataArray: [],
            laneArray: [ [], [], [], [], [] ]
            
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

        getCardStatus = (id)  => {
            let c = 0;  let col = -1;
            for (const l of this.state.laneArray) {
                for (const item of l) {
                    const itemString = item + "";
                    if (itemString == id) {
                        col = c;
                        return col
                    }
                }
                c++;
            }
        }

        cardClickedHandler = (id) => {
            const cardPos = this.cardPositionInArray(id);
            const data = this.getCardData(cardPos);
            const cardStatus = this.titles[this.getCardStatus(id)];
            // alert(data);
            this.setModalTitle(data);            
            this.setModalStatus(cardStatus);
            // this.setState({modalStatusNumber: col})

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
        // titles = ['Number closed', 'Setting Day2', 'Day2 set up', 'Lost lead', 'Closed'];
        colors = ['open', 'progress', 'test', 'reopened', 'closed'];
        DROP_COLOUR = "#BFC0C2";
        


        

        componentDidMount() {
            this.initCards();
        }

        initCards() {
            
            if (!this.state.testInit) {
                let i = 0;
                // let n = 0;

                let idArray = [];
                let dataArray = [];
                let laneArray = [ [], [], [], [], [] ];

            for (const t of this.titles) {
                // n = 0;
                const storeID = uniqid();
                const cardName = this.initNames[i];
                const dataToStore = [];
                const card = (<Card clicked = {this.cardClickedHandler}
                                    uniqueID = {storeID} >{cardName}</Card>);

                       
                        dataToStore.push(storeID);
                        dataToStore.push(cardName);

                        idArray.push(storeID); // idArray = [a, b, c, d, e]
                        dataArray.push(dataToStore); // = [ [a,blahblah] [b,blahblah] [c,blahblah] [d,blah] [e,blah]]
                        laneArray[i].push(storeID); // = [ [a] [b] [c] [d] [e] ]

                i++;
                
            }
            

            // const lane = (<Lane color={this.colors[i]} columnNumber={i} 
            //     title = {t} transfer={this.transferCards}>
            //              {card}
            // </Lane>);


            this.setState({ idArray: [...idArray] });
            this.setState({ dataArray: [...dataArray] });
            this.setState({ laneArray: [...laneArray] });
            this.setState({ testInit: true});
        }

        }
        cardPositionInArray(id) {
            const idArray = [...this.state.idArray];
            const index = idArray.indexOf(id);
            return index;
        }
        
        getCardData(pos) {
            const dataArray = [...this.state.dataArray];
            return dataArray[pos][1];
        }

        assertArraysAligned(id, pos) {
            // to-do
        }

        changeLane(id, destination) {
            

            const laneArray_temp = [...this.state.laneArray];
            let c = 0; let i = -1; let col = -1;
            
            loop2:
            for (const l of laneArray_temp) {
                let index = 0;
                for (const item of l) {
                    const itemString = item + "";
                    if (itemString == id) {
                        i = index;
                        col = c;
                        break loop2;
                    }
                    index++;
                }
                c++;
            }

            const cutCard = laneArray_temp[col].splice(i, 1); // cutting from original lane
            laneArray_temp[destination].push(cutCard);

            this.setState({ laneArray: [...laneArray_temp] });
        }


        transferCards = (id, dropColumn) =>  {
                const cardPos = this.cardPositionInArray(id);
                const data = this.getCardData(cardPos);
                this.changeLane(id, dropColumn);
                
            
            
        }

     

        render () {
            let i = 0;
            let c = 0;
         const laneArray = [...this.state.laneArray];
         const idArray = [...this.state.idArray];
         const dataArray = [...this.state.dataArray];
         let idIndex = -1;
         let data = "default";
         let cardComponent = "";
         let renderLanes = [[],[],[],[],[]];
         let oneLaneCards = [];

         for (const l of laneArray) {
             i = 0; idIndex = -1; data = "default"; cardComponent = "";
             oneLaneCards = [];
             // should be between here and the end
             for (const cardIdObj of l) {
                 
                 if (l.length === 0) {
                     continue;
                    }
                    
                const cardId = cardIdObj + ""; // not sure why this is

                 idIndex = idArray.indexOf(cardId);
                 
                 data = dataArray[idIndex][1]; // update to [1]
                 
                 cardComponent = ( <Card clicked = {this.cardClickedHandler}
                    uniqueID = {cardId}>{data}</Card>);
                    
                oneLaneCards.push(cardComponent);
                
                    
                 i++;
             }
                const lane = (<Lane color={this.colors[c]} columnNumber={c} 
                title = {this.titles[c]} transfer={this.transferCards}>
                         {oneLaneCards}
            </Lane>);
                renderLanes.push(lane);
             c++;
         }


            
            return (

                    <div className="wrapper">
                        {renderLanes}
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

