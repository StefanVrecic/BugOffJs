    import React, { Component } from 'react';
    import './TrelloBoard.css';
    import Card from '../components/Lane/Card';
    import Lane from '../components/Lane/Lane';
    import Modal from '../components/UI/Modal/Modal';
    import Axios from 'axios';
    // import { connect } from 'react-redux';
    import uniqid from 'uniqid';
    // import mongoose from 'mongoose';
    
    class TrelloBoard extends Component {
        constructor(props) {
            super(props);
            this.db_login("vstefan@hotmail.co.uk", "vstefan");
        }
        // this.db_loadCards();


        db_login(user, userPassword) {

                Axios.post("http://localhost:8080/users/login", {
        "email": user, "password": userPassword}
        )
        .then(
        function (response) { 
            console.log("success login - call loadCards()"); 
            console.log(response.data.token);
            // need to store this token
            window.localStorage.setItem("login-token", response.data.token);
        })
        .then(() => {
            this.db_loadCards();
        }
        )
        .catch(
            function (error) {
            console.log("fail login"); 
            console.log(error.config.data);
        })

        }

        db_loadCards() {

            Axios.get(
                "http://localhost:8080/bugs/",
                {headers: {
                    "Authorization" : "Bearer "+window.localStorage.getItem("login-token")
                  }
                }
              )
              .then((response) => {
                  var response = response.data;
                  console.log("success loading cards");
                  console.log(response);
                    this.processLoadedCards(response);
                },
                (error) => {
                  var status = error.response.status
                  alert("fail loadCards")
                }
              );


              
        }
        // titles = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];
        statusToLaneNumber(status) {
            return this.titles.indexOf(status);
        }

        processLoadedCards(loadedData) {
            const idArray = [];
            const laneArray = [ [], [], [], [], [] ];
            const dataArray = []; var dataArrayItem = [];
            // alert(data);
            for (const dataItem of loadedData) {
                // alert(JSON.stringify(dataItem));
                const data = [];
                dataArrayItem = [];
                dataArrayItem.push(dataItem._id);

                // data.push("item");
                dataArrayItem.push(dataItem.name);
                dataArrayItem.push(dataItem.status);
                // dataArrayItem.push(dataItem.name); // push other data that is not id
                const lane = this.statusToLaneNumber(dataItem.status);
                
                idArray.push(dataItem._id);
                dataArray.push(dataArrayItem);
                laneArray[lane].push(dataItem._id);
                
                
            }
            this.setState({ idArray: [...idArray] });
            // this.setState({ idArray: [...idArray] }, this.db_createTasks);
            this.setState({ dataArray: [...dataArray] });
            this.setState({ laneArray: [...laneArray] });
            this.setState({ testInit: true});
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
        
        db_updateCardStatus(id) {
             const status_int = this.getCardStatus(id);
             const status_string = this.titles[status_int];
            // alert(id + " / " + status_string);
            Axios.patch(`http://localhost:8080/bugs/${id}`, {
                    "status": status_string}
                    )
                    .then(function (response){
                        console.log("updated status");
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log("failed status update");
                        console.log(error.config.data);
                    })
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
        

        componentDidUpdate() {
            
        }
        

        componentDidMount() {
            // this.initCards();
        }

       

        

        db_createTasks() {
                
            // drop db
            // post tasks to db
            
            // var newId = new mongoose.mongo.ObjectId('5e1010ec9a353812f0e6b025');

            const idArray = [...this.state.idArray];
            var i = 0;
            for (i = 0; i < idArray.length; i++) {
                
                Axios.post("http://localhost:8080/bugs", {
                    "name": idArray[i], "owner": "Stefan"}
                    )
                    .then(function (response){
                        console.log("success");
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log("fail");
                        console.log(error.config.data);
                    })
                }
                    
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
                const storeID = uniqid.process();
                const cardName = this.initNames[i];
                const dataToStore = [];
                const card = (<Card clicked = {this.cardClickedHandler}
                                    uniqueid = {storeID} >{cardName}</Card>);

                       
                        dataToStore.push(storeID);
                        dataToStore.push(cardName);
                        dataToStore.push("description");

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
            // this.setState({ idArray: [...idArray] }, this.db_createTasks);
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

            this.setState({ laneArray: [...laneArray_temp] },
                this.db_updateCardStatus(id));

        }


        transferCards = (id, dropColumn) =>  {
                const cardPos = this.cardPositionInArray(id);
                const data = this.getCardData(cardPos);
                this.changeLane(id, dropColumn);

                
                console.log("posting to db");
                
                
            // this.db_createTasks();
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
                    uniqueid = {cardId}>{data}</Card>);
                    
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
// loop through pre-defined properties
                // for each property, create an array
                // if the data from db contains that property, push it . Otherwise push undefined
                // push this array into a main dataArray
                // when reading this data: 

                // const dataItemProperties = [];
                // this.propertiesManaged = [description, tite, status] - put global
                // for (const property of this.propertiesManaged) {
                    // if (dataItem.property) {
                        // dataItemProperties.push(dataItem.property);
                    // } else {
                        // dataItemProperties.push(undefined);
                    // }
                // }
                
                // dataProperties.push(dataItemProperties);
                // to access - plug in the id
                
                // const cardPos = this.cardPositionInArray(id);
                // const cardProperties = dataArray[cardPos]
                
                // now we have all the data for the given card
                // propertyToChange will be pre-defined by a button, an input field etc
                
                // cardProperties[this.propertiesManaged.indexOf('propertyToChange')] = newValue ||
                // const getValue = cardProperties[this.propertiesManaged.indexOf('propertyToChange')]
