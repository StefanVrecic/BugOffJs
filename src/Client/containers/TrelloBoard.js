        import React, { Component } from "react";
        import "./TrelloBoard.css";
        import Card from "../components/Lane/Card";
        import Lane from "../components/Lane/Lane";
        import MainModal from "../components/UI/Modal/MainModal";
        import axios from "axios";
        import mongoose from 'mongoose';
        import { connect } from 'react-redux';
        
        // import Modal from "../components/UI/Modal/Modal";
        // import uniqid from "uniqid";

        // data order: warning
        // id, text, status, [description]
        // const name = data[1];
        // const status = data[2];
        // const description = data[3];
        // const dueDate = data[4];
        // const severity = data[5];
            // Methods in file
            // db_loadCards(), statusToLaneNumber, // processLoadedCards,db_updateCardStatus,
            // setModalTitle,setModalStatus, // closeModalHandler,getCardStatus,
            // cardClickedHandler,openModalHandler, // axiosConnect,db_createCard,
            // initCards,cardPositionInArray, // getCardTitle,assertArraysAligned ,

        class TrelloBoard extends Component {

        state = {
            // items
            modalTitle: "default",
            modalStatus: "default",
            modalStatusNumber: -1,
            
            cardModal: false, // not required - Different logic in panel
            activeCard: "-1", // not required
            idArray: [], // required - to create cards
            dataArray: [], // only accessed in modals (and list?) => actually, TrelloBoard.js needs the name 
            laneArray: [[], [], [], [], []], // required to track lanes
            addCard_laneOpen: "-1", // required *only* locally
            modalData: [] // only required inside modals?
            // /items
            // how about providing idArray & laneArray from Panel.js + best way to provide the name?
            // could make an array containing [ [id,name,status], [id,name,status]] etc. ?
            // then addCard_laneOpen will remain in the state.
            // ... what about creating a new card?
        };

        titles = ["Open", "In progress", "To be tested", "Re-opened", "Closed"];
        colors = ["open", "progress", "test", "reopened", "closed"];

        componentDidUpdate(prevProps) {
            // Typical usage (don't forget to compare props):
            if (this.props.panelCard !== prevProps.panelCard) {
                // alert("someone opened a card from a modal" + "." + prevProps.panelCard + " . " + this.props.panelCard);
                this.cardClickedHandler(this.props.panelCard);
            
            }
          }
        
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
            this.props.updateModalData(data); // redux call
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

                // name = data[1]; status = [2]; description = [3]; dueDate = [4]; 
                // severity = [5]; overdueConfirmed = [6]; activity = data[7];

                // WARNING DO NOT CHANGE ORDER OF dataArrayItem.push
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
            // redux calls
            this.props.updateIdArray(idArray);
            // this.setState({ idArray: [...idArray] });
            
            this.props.updateDataArray(dataArray); // redux call
            // this.setState({ dataArray: [...dataArray] });

            this.setState({ laneArray: [...laneArray] });
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

        orderBySeverity = () => {
            const dataArray = [...this.props.dataArray];
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
            // this.props.clickedCard(id);
            // return;
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
            const idArray = [...this.props.idArray];
            const index = idArray.indexOf(id);
            // alert(index + " index of " + id);
            return index;
        }

        deleteItem = () => {
            const deleteId = this.state.activeCard;
            this.setState({activeCard: "-1"});

            const idArray = [...this.props.idArray];
            const laneArray = [...this.state.laneArray];
            const dataArray = [...this.props.dataArray];

            const deleteIndex = idArray.indexOf(deleteId);
            const activeCardLane = this.getCardLane(deleteId);
            // alert(this.cardPosInLane(deleteId)); // Could use this instead below
            const indexInLane = laneArray[activeCardLane].indexOf(deleteId);


            idArray.splice(deleteIndex, 1);
            laneArray[activeCardLane].splice(indexInLane, 1);
            dataArray.splice(deleteIndex, 1);
  

            this.setState({ laneArray: [...laneArray] });

                // this.setState({ idArray: [...idArray] });
                this.props.updateIdArray([...idArray]);
                
                    // this.setState({ dataArray: [...dataArray] },
                        this.props.updateDataArray([...dataArray]);
                        // warning needs call back
                    //    () => {
        this.db_deleteItem(deleteId);
                    //     });  
            this.closeModalHandler();

        };

        addingCard = (col) => {
            this.setState( { addCard_laneOpen: col });
        }
    
        getCardData(pos) {
            const dataArray = [...this.props.dataArray];
            return dataArray[pos];
        }

        getCardTitle(pos) {
            const dataArray = [...this.props.dataArray];
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

            this.setState({ laneArray: [...laneArray_temp] },
            this.db_updateCardStatus(id));
        }

        transferCards = (id, dropColumn) => {
            this.changeLane(id, dropColumn);
        }

        addCard = (cardText, lane)  => {
            // const storeId = uniqid();
                
            var storeId = (mongoose.Types.ObjectId());
            var storeId_string = storeId+"";

            
                const laneArray = [...this.state.laneArray];
                const idArray = [...this.props.idArray];
                const dataArray = [...this.props.dataArray];
                idArray.push(storeId_string);
                laneArray[lane].push(storeId_string);
                const dataToStore = [];
// name = data[1]; status=[2]; description=[3]; dueDate=[4]; severity=[5]; overdueConfirmed= [6]; activity = [7];
                // data for each card - WARNING: don't change order
                const status = this.laneNumberToStatus(lane);

                dataToStore.push(storeId_string); 
                dataToStore.push(cardText);
                dataToStore.push(status);
                dataToStore.push("No decription provided");
                dataToStore.push(null);
                dataToStore.push("Severity");
                dataToStore.push(false); // overdueConfirmed
                dataToStore.push([]); // notes
                // alert(cardText + " .... cardText");
                dataArray.push(dataToStore);

                this.setState({ laneArray: [...laneArray] });

                // this.setState({ idArray: [...idArray] });
                this.props.updateIdArray([...idArray]);
                
                // this.setState({ dataArray: [...dataArray] },

                this.props.updateDataArray([...dataArray]);
                
                // , // this below needs callback warning
                    //    () => {
                            this.db_createCard(storeId, cardText, status);
                    //     });                         
        }
        
        viewActivityNotes = () => {
            this.setState({ cardModal: false });
            this.props.viewActivityNotes();
        }

        saveNewNote = (note) => {
            // data [7]
            const now = new Date();

            const updatedDataArray = [...this.props.dataArray];
            const activeCard = this.state.activeCard;
            const cardPos = this.cardPositionInArray(activeCard);
            updatedDataArray[cardPos][7].push(now+"/timeNoteSplit/"+note);
            this.setState({dataArray: [...updatedDataArray]});
            this.props.updateDataArray(updatedDataArray); // redux call

            this.db_updateCardData(activeCard, updatedDataArray[cardPos]);
        }

        render() {
            
            let c = 0;
            const laneArray = [...this.state.laneArray];
            const idArray = [...this.props.idArray];
            const dataArray = [...this.props.dataArray];
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
                if (idIndex == -1) {
                    continue;
                }
                // alert(idIndex + " ... idIndex " + cardId + " .... ");
                // alert(idArray);
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
            // this.orderByDate();
            
            return (
            <div className="wrapper">
                {renderLanes}
                

                 <MainModal
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
                viewNotes={this.viewActivityNotes}
            ></MainModal>

            </div>
            );
        }
        // {/* events={this.modalData[7]} */}f
////////////////////////////////////// Modal methods ///////////////////////

    addDescriptionHandler = (text) => {
        const cardId = this.state.activeCard;
        // get position in index
        const cardPos = this.cardPositionInArray(cardId);
        const dataArray = [...this.props.dataArray];

        // needs to be dynamic
        dataArray[cardPos][3] = text;
        
        // this.setState( { dataArray: [...dataArray]})
        this.props.updateDataArray(dataArray); // redux call
        this.db_updateCardData(cardId, dataArray[cardPos]);
        
        
        // const cardData = this.state.dataArray[]
    }

    saveDateHandler = (date) => {
        // alert(date + " trllo");
        const cardId = this.state.activeCard;
        // get position in index
        const cardPos = this.cardPositionInArray(cardId);
        const dataArray = [...this.props.dataArray];// needs to be dynamic
        dataArray[cardPos][4] = date;
        
        // this.setState( { dataArray: [...dataArray]})
        this.props.updateDataArray(dataArray); // redux call
        this.db_updateCardData(cardId, dataArray[cardPos]);
    }

    saveSeverityHandler = (severity) => {
             // alert(date + " trllo");
             const cardId = this.state.activeCard;
             // get position in index
             const cardPos = this.cardPositionInArray(cardId);
             const dataArray = [...this.props.dataArray];// needs to be dynamic
             dataArray[cardPos][5] = severity;
             
            //  this.setState( { dataArray: [...dataArray]})
             this.props.updateDataArray(dataArray); // redux call
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

        

        db_createCard(id, cardTitle, status) {
            // alert("db cretecard");
            // const cardPos = this.cardPositionInArray(id+"");
            // const cardTitle = this.getCardTitle(cardPos);
            // alert(cardPos + ' ... cardPos');
            // alert(cardTitle + ' ... cardTitlte');
            // const status = this.getCardStatus(id+"");  
         
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
            const idArray = [...this.props.idArray];

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

        // now access the redux with this.props.idArray or this.props.dataArray etc
const mapStateToProps = state => {
	return {
		idArray: state.idArray,
		dataArray: state.dataArray,
		modalData: state.modalData
	};
};
// call via this.props.updateIdArray or this.props.updateDataArray
const mapDispatchToProps = dispatch => {
	return {
		updateIdArray: (newArray) => dispatch({type: 'idArray_update', payload: newArray}),
		updateDataArray: (newArray) => dispatch({type: 'dataArray_update', payload: newArray}),
		updateModalData: (newArray) => dispatch({type: 'modalData_update', payload: newArray})
}; };

export default connect(mapStateToProps, mapDispatchToProps)(TrelloBoard);

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


        // transferred to Panel.js
        // testDeadLine() {
        //     console.log("start");
        //     const now = new Date();
        //     // const now = mongoose.Date();
        //     const overdue = [];
        //     const upcoming = [];
        //     const dataArray = this.orderByDate();
        //     for (const d of dataArray) {
        //         if (d[6] == true) {
        //             continue; // don't addd items if user already confirmed that they know it's overdue
        //         }
        //         if (d[2] == "Closed") {
        //             continue; // do not show closed items in Deadlines modal
        //         }
        //         var date = new Date(d[4]);
        //         if (date > now) {
        //             upcoming.push(d);
        //         } else {
        //             overdue.push(d);
        //         }
        //     }
        //     // target: duedate + description + severity + [ ] + (VIEW)
        //         // const name = data[1];
        //         // const status = data[2];
        //         // const description = data[3];
        //         // const dueDate = data[4];
        //         // const severity = data[5];
        //         // const overdueConfirmed = data[6];
        //         // const activity = data[7];
        //     console.log(
        //         "============================================OVERDUE============================================")
                
        //     for (const o of overdue) 
        //     console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
            
        //     console.log(
        //         "============================================UPCOMING============================================")

        //     for (const o of upcoming) 
        //     console.log(o[4] + " / " + o[2] + " / " + o[5] + " [ ] " + " VIEW-"+o[0]);
            
        //         const returnArray = [];
        //         returnArray.push(overdue);
        //         returnArray.push(upcoming);

        //         return returnArray;
        // }
        // orderByDate = () => {
        //     const dataArray = [...this.state.dataArray];
        //     // cleansing - no undefined dates in array.
        //     let i = 0;
        //     const toSplice = [];
        //     for (const c of dataArray) {
        //         if (c[4] === undefined || c[4] == null) {
        //             toSplice.push(i);
        //         }
        //         i++;
        //     }
        //     i = 0;
            
        //     for (i = 0; i < toSplice.length; i++) {
        //         dataArray.splice(toSplice[i]-i, 1); // needs to compensate for the previously removed element
        //         // no native function for this?? 
        //     }

        //     // for (const c of dataArray) {
        //     //     console.log(c[4]);
        //     // }
        //     const sortData = dataArray.sort(this.sortDate);
        //     for (const c of sortData) {
        //         // console.log(c[4]);
        //     }
        //     return sortData;
        // }

        //        sortDate(a, b) {
        // const c = 4;
        //     if (a[c] === b[c]) {
        //         return 0;
        //     }
        //     else {
        //         return (a[c] < b[c]) ? -1 : 1;
        //     }
        // }
        //  name = data[1]; status = [2]; description = [3]; dueDate = [4]; severity = [5];
        // Goal format: {ts: "2017-09-17T12:22:46.587Z", text: 'Logged in'},
        // cleanseActivity = (data) => {
        //     const cleansedActivity = [];
        
        // for (const d of data) {
        //     var subDivide = d.split('/timeNoteSplit/');
        //     var elements = new Object();
        //     elements.ts = subDivide[0];
        //     elements.text = subDivide[1];
        //     cleansedActivity.push(elements)
        // }
        // return cleansedActivity
        // }