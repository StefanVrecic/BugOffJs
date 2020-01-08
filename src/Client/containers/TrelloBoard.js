        import React, { Component } from "react";
        import "./TrelloBoard.css";
        import Card from "../components/Lane/Card";
        import Lane from "../components/Lane/Lane";
        import Modal from "../components/UI/Modal/Modal";
        import MainModal from "../components/UI/Modal/MainModal";
        import ActivityModal from "../components/UI/Modal/ActivityModal";
        import DeadlinesModal from '../components/UI/Modal/DeadlinesModal';
        import axios from "axios";
        import uniqid from "uniqid";
        import mongoose, { Mongoose } from 'mongoose';


        // data order:
        // id, text, status, [description]
        // const name = data[1];
        // const status = data[2];
        // const description = data[3];
        // const dueDate = data[4];
        // const severity = data[5];

            // db_loadCards()
            // statusToLaneNumber
            // processLoadedCards
            // db_updateCardStatus
            // setModalTitle
            // setModalStatus
            // closeModalHandler
            // closeModalHandler
            // getCardStatus
            // cardClickedHandler
            // openModalHandler
            // axiosConnect
            // cardClickedHandler
            // openModalHandler
            // axiosConnect
            // componentDidUpdate
            // componentDidMount
            // db_createCard
            // initCards
            // cardPositionInArray
            // getCardTitle
            // assertArraysAligned 
        class TrelloBoard extends Component {
        constructor(props) {
            super(props);
        }

        // warning
        state = {
            cardModal: false,
            modalTitle: "default",
            modalStatus: "default",
            modalStatusNumber: -1,
            activeCard: "-1",
            cards: [[], [], [], [], []], // this should actually be lanes?
            lanes: [],
            idArray: [],
            dataArray: [],
            laneArray: [[], [], [], [], []],
            addCard_laneOpen: "-1",
            modalData: []
        };

        titles = ["Open", "In progress", "To be tested", "Re-opened", "Closed"];
        colors = ["open", "progress", "test", "reopened", "closed"];

        componentDidUpdate() {}
        
        componentDidMount() {
            this.db_loadCards();
        }

        setAddCardLaneOpen = col => {
            this.setState({ setAddCardLaneOpen: col})
        }
        
        setModalTitle = name => {
            this.setState({ modalTitle: name });
        };

        setModalStatus = status => {
            this.setState({ modalStatus: status });
        };

        setModalData = data => {
            this.setState( { modalData: data });
        }

        closeModalHandler = () => {
            this.setState({ cardModal: false });
            // don't want any residual data from previous modal. Failsafe.
            this.setModalData([]);

        };

        openModalHandler = () => {
            this.setState({ cardModal: true });
        };

        cardPosInLane = id => {
            const laneNumber = this.getCardLane(id);
            return this.state.laneArray[laneNumber].indexOf(id);
        }

        // titles = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];
        statusToLaneNumber(status) {
            return this.titles.indexOf(status);
        }
        laneNumberToStatus(lane) {
            return this.titles[lane];
        }

        processLoadedCards(loadedData) {
            const idArray = [];
            const laneArray = [[], [], [], [], []];
            const dataArray = [];
            var dataArrayItem = [];
            
            for (const dataItem of loadedData) {
            
                dataArrayItem = [];
                dataArrayItem.push(dataItem._id);

                // const name = data[1];
                // const status = data[2];
                // const description = data[3];
                // const dueDate = data[4];
                // const severity = data[5];
                // const overdueConfirmed = data[6];
                // const activity = data[7];
                // WARNING
                // DO NOT CHANGE ORDER OF dataArrayItem.push
                dataArrayItem.push(dataItem.name);
                dataArrayItem.push(dataItem.status);
                dataArrayItem.push(dataItem.description);
                dataArrayItem.push(dataItem.dueDate); // needs to be converted to date?
                dataArrayItem.push(dataItem.severity);
                dataArrayItem.push(dataItem.overdueConfirmed);
                dataArrayItem.push(dataItem.activity);
               
                // alert("... " + dataItem.dueDate);
                // alert(dataItem.severity + "\n" + dataItem.name);
                // if (dataItem.severity != undefined) {
                //     alert(dataItem.severity + "\n" + dataItem.name);
                // } else {
                //     continue;
                // }
               
                // dataArrayItem.push(dataItem.data); // push other data that is not id
                const lane = this.statusToLaneNumber(dataItem.status);

                idArray.push(dataItem._id);
                dataArray.push(dataArrayItem);
                laneArray[lane].push(dataItem._id);
            }

            this.setState({ idArray: [...idArray] });
            this.setState({ dataArray: [...dataArray] });
            this.setState({ laneArray: [...laneArray] });
        }
        // const name = data[1];
        // const status = data[2];
        // const description = data[3];
        // const dueDate = data[4];
        // const severity = data[5];
        // Goal format: {ts: "2017-09-17T12:22:46.587Z", text: 'Logged in'},
        cleanseActivity = (data) => {
            const cleansedActivity = [];
        
        for (const d of data) {
            var subDivide = d.split('/timeNoteSplit/');
            var elements = new Object();
            elements.ts = subDivide[0];
            elements.text = subDivide[1];
            cleansedActivity.push(elements)
        }
        return cleansedActivity
        }

        sortDate(a, b) {
           const c = 4;
            if (a[c] === b[c]) {
                return 0;
            }
            else {
                return (a[c] < b[c]) ? -1 : 1;
            }
        }

        sortSeverity(a, b) {
            const c=5;
            if (a[c] === b[c]) {
                return 0;
            }
            else {
            if (a[c] === "High") {
                return -1;
            }
            if (b[c] === "High") {
                return 1;
            }
                return (a[c] > b[c]) ? -1 : 1;
            }
        }

        orderByDate = () => {
            const dataArray = [...this.state.dataArray];
            // cleansing - no undefined dates in array.
            let i = 0;
            const toSplice = [];
            for (const c of dataArray) {
                if (c[4] === undefined || c[4] == null) {
                    toSplice.push(i);
                }
                i++;
            }
            i = 0;
            
            for (i = 0; i < toSplice.length; i++) {
                dataArray.splice(toSplice[i]-i, 1); // needs to compensate for the previously removed element
                // no native function for this?? 
            }

            // for (const c of dataArray) {
            //     console.log(c[4]);
            // }
            const sortData = dataArray.sort(this.sortDate);
            for (const c of sortData) {
                // console.log(c[4]);
            }
            return sortData;
        }
        
        orderBySeverity = () => {
            const dataArray = [...this.state.dataArray];
            console.log(dataArray.sort(this.sortSeverity) + " new");
        }

        toString(name, arrayProvided) {
            let output = "";
            if (name === "id") {
                for (const id of arrayProvided) {
                    output = output + "\n" + id;
                }

            } else if (name === "data") {

            } else if (name === "lane") {
                for (const lane of arrayProvided) {
                    let laneContent = "";
                    for (const l of lane) {
                        laneContent = laneContent + "\n" +  l  ;
                    }
                    output = output + laneContent + "\n\n"
                }
            }
            return output;
        }

        getCardLane = id => {
            let c = 0;
            let col = -1;
            for (const l of this.state.laneArray) {
            for (const item of l) {
                const itemString = item + "";
                if (itemString == id) {
                col = c;
                return col;
                }
            }
            c++;
            }
        }

        getCardStatus = id => {
            return this.titles[this.getCardLane(id)];
        };

        setActiveCard = id => {
            this.setState({activeCard: id})
        }

        cardClickedHandler = id => {
            const cardPos = this.cardPositionInArray(id);
            const title = this.getCardTitle(cardPos);
            const cardStatus = this.getCardStatus(id);

            const data = this.getCardData(cardPos);

            this.setModalTitle(title);
            this.setModalStatus(cardStatus);
            this.setActiveCard(id);
            this.setModalData(data);
            // alert(data);
            this.openModalHandler();
        };

        cardPositionInArray(id) {
            const idArray = [...this.state.idArray];
            const index = idArray.indexOf(id);
            return index;
        }

        deleteItem = () => {
            const deleteId = this.state.activeCard;
            this.setState({activeCard: "-1"});
            const idArray = [...this.state.idArray];
            const laneArray = [...this.state.laneArray];
            const dataArray = [...this.state.dataArray];
            const deleteIndex = idArray.indexOf(deleteId);
            const activeCardLane = this.getCardLane(deleteId);
            // alert(this.cardPosInLane(deleteId)); // Could use this instead below
            const indexInLane = laneArray[activeCardLane].indexOf(deleteId);


            idArray.splice(deleteIndex, 1);
            laneArray[activeCardLane].splice(indexInLane, 1);
            dataArray.splice(deleteIndex, 1);
  

            this.setState({ laneArray: [...laneArray] });

                this.setState({ idArray: [...idArray] });
                    this.setState({ dataArray: [...dataArray] },
                       () => {
                            this.db_deleteItem(deleteId)
                        });  
            this.closeModalHandler();

        };

        addingCard = (col) =>  {
            
            this.setState( { addCard_laneOpen: col });
        }
    
        getCardData(pos) {
            const dataArray = [...this.state.dataArray];
            return dataArray[pos];
        }

        getCardTitle(pos) {
            const dataArray = [...this.state.dataArray];
            return dataArray[pos][1];
        }

        assertArraysAligned(id, pos) {
            // to-do
        }

        changeLane(id, destination) {
            const laneArray_temp = [...this.state.laneArray];
            let c = 0;
            let i = -1;
            let col = -1;

            loop2: for (const l of laneArray_temp) {
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

            this.setState(
            { laneArray: [...laneArray_temp] },
            this.db_updateCardStatus(id)
            );
        }

        transferCards = (id, dropColumn) => {
            this.changeLane(id, dropColumn);
        }

        addCard = (cardText, lane)  => {
            // const storeId = uniqid();
                
            var storeId = (mongoose.Types.ObjectId());
            var storeId_string = storeId+"";

            
                const laneArray = [...this.state.laneArray];
                const idArray = [...this.state.idArray];
                const dataArray = [...this.state.dataArray];
                idArray.push(storeId_string);
                laneArray[lane].push(storeId_string);
                const dataToStore = [];

                // const name = data[1];
                // const status = data[2];
                // const description = data[3];
                // const dueDate = data[4];
                // const severity = data[5];
                // const overdueConfirmed = data[6];
                // const activity = data[7];
                // data for each card - WARNING: don't change order
                dataToStore.push(storeId_string); 
                dataToStore.push(cardText);
                dataToStore.push(this.laneNumberToStatus(lane));
                dataToStore.push("No decription provided");
                dataToStore.push(null);
                dataToStore.push("Severity");
                dataToStore.push(false); // overdueConfirmed
                dataToStore.push([]); // notes

                dataArray.push(dataToStore);

                this.setState({ laneArray: [...laneArray] });

                this.setState({ idArray: [...idArray] });
                    this.setState({ dataArray: [...dataArray] },
                       () => {
                            this.db_createCard(storeId)
                        });                         
        }

        saveNewNote = (note) => {
            // data [7]
            const now = new Date();

            const updatedDataArray = [...this.state.dataArray];
            const activeCard = this.state.activeCard;
            const cardPos = this.cardPositionInArray(activeCard);
            updatedDataArray[cardPos][7].push("time="+now+"/time"+note);
            this.setState({dataArray: [...updatedDataArray]});

            this.db_updateCardData(activeCard, updatedDataArray[cardPos]);
        }

        testDeadLine() {
            console.log("start");
            const now = new Date();
            // const now = mongoose.Date();
            const overdue = [];
            const upcoming = [];
            const dataArray = this.orderByDate();
            for (const d of dataArray) {
                if (d[6] == true) {
                    continue; // don't addd items if user already confirmed that they know it's overdue
                }
                if (d[2] == "Closed") {
                    continue; // do not show closed items in Deadlines modal
                }
                var date = new Date(d[4]);
                if (date > now) {
                    upcoming.push(d);
                } else {
                    overdue.push(d);
                }
            }
            // target: duedate + description + severity + [ ] + (VIEW)
                // const name = data[1];
                // const status = data[2];
                // const description = data[3];
                // const dueDate = data[4];
                // const severity = data[5];
                // const overdueConfirmed = data[6];
                // const activity = data[7];
            console.log(
                "============================================OVERDUE============================================")
                
            for (const o of overdue) 
            console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
            
            console.log(
                "============================================UPCOMING============================================")

            for (const o of upcoming) 
            console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
            
                const returnArray = [];
                returnArray.push(overdue);
                returnArray.push(upcoming);

                return returnArray;
        }

        render() {
            let upcoming = []; let overdue = [];
            if (this.state.dataArray.length > 0) {
                alert("-");
            const deadLines = this.testDeadLine();
            overdue = deadLines[0];
            upcoming = deadLines[1];
        }

            // tidy
            // let events =  [
            //     {ts: "2017-09-17T12:22:46.587Z", text: 'Logged in'},
            //     {ts: "2017-09-17T12:21:46.587Z", text: 'Clicked Home Page'},
            //     {ts: "2017-09-17T12:20:46.587Z", text: 'Edited Profile'},
            //     {ts: "2017-09-16T12:22:46.587Z", text: 'Registred'},
            //     {ts: "2017-09-16T12:21:46.587Z", text: 'Clicked Cart'},
            //     {ts: "2017-09-16T12:20:46.587Z", text: 'Clicked Checkout'},
            //   ];
            //   alert(events[0].ts);
            //   alert(events[0].text);
            // if (this.state.modalData.length > 0) {
            //     if (this.state.modalData[7].length > 0) {
            //         const cleansed = this.cleanseActivity(this.state.modalData[7]).reverse();
            //         events = cleansed;
            //     }
            // }
            // end Tidy


            let c = 0;
            const laneArray = [...this.state.laneArray];
            const idArray = [...this.state.idArray];
            const dataArray = [...this.state.dataArray];
            let idIndex = -1;
            let data = "default";
            let cardComponent = "";
            let renderLanes = [[], [], [], [], []];
            let oneLaneCards = [];

            for (const l of laneArray) {
            idIndex = -1;
            data = "default";
            cardComponent = "";
            oneLaneCards = [];
            
            for (const cardIdObj of l) {
                if (l.length === 0) {
                continue;
                }

                const cardId = cardIdObj + ""; // not sure why this is

                idIndex = idArray.indexOf(cardId);

                data = dataArray[idIndex][1]; // update to [1]

                cardComponent = (
                <Card clicked={this.cardClickedHandler} uniqueid={cardId}>
                    {data}
                </Card>
                );

                oneLaneCards.push(cardComponent);

            }
            const lane = (
                <Lane
                addCardMethod={this.addCard}
                color={this.colors[c]}
                columnNumber={c}
                title={this.titles[c]}
                transfer={this.transferCards}
                laneAddCardOpen={this.state.addCard_laneOpen===c}
                addingCard_lane={this.addingCard}
                >
                {oneLaneCards}
                </Lane>
            );
            renderLanes.push(lane);
            c++;
            }
            this.orderByDate();
            
            return (
            <div className="wrapper">
                {renderLanes}
                {/* <Modal
                show={this.state.cardModal}
                modalClosed={this.closeModalHandler}
                status={this.state.modalStatus}
                title={this.state.modalTitle}
                color={this.state.modalStatusNumber}
                deleteItemModal={this.deleteItem}
                ></Modal> */}
                 {/* <MainModal
                show={this.state.cardModal}
                modalClosed={this.closeModalHandler}
                status={this.state.modalStatus}
                title={this.state.modalTitle}
                data={this.state.modalData}
                color={this.state.modalStatusNumber}
                deleteItemModal={this.deleteItem}
                addDescription={this.addDescriptionHandler}
                addDate={this.saveDateHandler}
                addSeverity={this.saveSeverityHandler}
                postNewNote={this.saveNewNote}
            ></MainModal> */}

                {/* <ActivityModal 
                    closeModal={this.closeModalHandler}
                    show={this.state.cardModal}
                    events={events}
                    ></ActivityModal> */}
                    
                    <DeadlinesModal 
                    closeModal={this.closeModalHandler}
                    show={this.state.cardModal}
                    upcomingTasks={upcoming}
                    overdueTasks={overdue}
                    ></DeadlinesModal>

            </div>
            );
        }
        // {/* events={this.modalData[7]} */}f
////////////////////////////////////// Modal methods ///////////////////////

    addDescriptionHandler = (text) => {
        const cardId = this.state.activeCard;
        // get position in index
        const cardPos = this.cardPositionInArray(cardId);
        const dataArray = [...this.state.dataArray];

        // needs to be dynamic
        dataArray[cardPos][3] = text;
        
        this.setState( { dataArray: [...dataArray]})
        this.db_updateCardData(cardId, dataArray[cardPos]);
        
        
        // const cardData = this.state.dataArray[]
    }

    saveDateHandler = (date) => {
        // alert(date + " trllo");
        const cardId = this.state.activeCard;
        // get position in index
        const cardPos = this.cardPositionInArray(cardId);
        const dataArray = [...this.state.dataArray];// needs to be dynamic
        dataArray[cardPos][4] = date;
        
        this.setState( { dataArray: [...dataArray]})
        this.db_updateCardData(cardId, dataArray[cardPos]);
    }

    saveSeverityHandler = (severity) => {
             // alert(date + " trllo");
             const cardId = this.state.activeCard;
             // get position in index
             const cardPos = this.cardPositionInArray(cardId);
             const dataArray = [...this.state.dataArray];// needs to be dynamic
             dataArray[cardPos][5] = severity;
             
             this.setState( { dataArray: [...dataArray]})
             this.db_updateCardData(cardId, dataArray[cardPos]);
    }

//////////////////////////////////// db methods ////////////////////////
        

        db_deleteItem(id) {
            const instance = axios.create({
                baseURL: 'http://localhost:8080',
                headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
              });

              instance.delete("/bugs/"+id, {
            })
                .then(response => {
                console.log("success delete" + response);
            })
            .catch(error => {
                console.log("failure deleting card " + error.config.data);
            });
        }

        db_updateCardData(id, data) {

            // alert(data + "\n\ndb-updateCard\n\nid: " + id);
            // warning
            const name = data[1];
            const status = data[2];
            const description = data[3];
            const dueDate = data[4];
            const severity = data[5];
            const overdueConfirmed = data[6];
            const activity = data[7];
            axios
            .patch(`http://localhost:8080/bugs/${id}`, {
                name, description, status, dueDate, severity, overdueConfirmed, activity
                
            })
            .then(function(response) {
                console.log("updated status");
                console.log(response);
            })
            .catch(function(error) {
                console.log("failed status update");
                console.log(error.config.data);
            });
        }

        db_updateCardStatus(id) {
            const status_string = this.getCardStatus(id);
            
            axios
            .patch(`http://localhost:8080/bugs/${id}`, {
                status: status_string
                
            })
            .then(function(response) {
                console.log("updated status");
                console.log(response);
            })
            .catch(function(error) {
                console.log("failed status update");
                console.log(error.config.data);
            });
        }

        

        db_createCard(id) {
            const cardPos = this.cardPositionInArray(id+"");
            const cardTitle = this.getCardTitle(cardPos);

            const status = this.getCardStatus(id+"");  
         
              const instance = axios.create({
                baseURL: 'http://localhost:8080',
                headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
              });

            instance.post("/bugs", { // WARNING
              _id: id, name: cardTitle, status: status, description: "No description provided", dueDate: null,
              severity: null, overdueConfirmed: false, notes: null
            })
                .then(function(response) {
                console.log("success create" + response);
                console.log(response);
            })
            .catch(function(error) {
                console.log("failure creating card");
                console.log(error.config.data);
            });
        }

        db_loadCards() {
            axios
            .get("http://localhost:8080/bugs/", {
                headers: {
                Authorization: "Bearer " + window.localStorage.getItem("login-token")
                }
            })
            .then(
                response => {
                var response = response.data;
                console.log("success loading cards");
                console.log(response);
                this.processLoadedCards(response);
                },
                error => {
                var status = error.response.status;
                console.log("fail loadCards");
                }
            )
            .then(() => 
                this.exportData()
            )  
        }

        exportData() {
            const time = new Date();
            let content = time + "\n\n";
            const idArray = [...this.state.idArray];

            for (const c of idArray) {
                const stat = " Status: " + this.getCardStatus(c);
                const cardPos = this.cardPositionInArray(c);
                const data = " Name: " + this.getCardTitle(cardPos);
                const exportData = data + "\n" + stat +"\n\n";
                content = content + exportData;
            }
            // alert(content);
            const uriContent = "data:application/octet-stream," + encodeURIComponent(content);
            // const newWindow = window.open(uriContent, 'Document');
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
