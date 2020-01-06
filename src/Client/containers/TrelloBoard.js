        import React, { Component } from "react";
        import "./TrelloBoard.css";
        import Card from "../components/Lane/Card";
        import Lane from "../components/Lane/Lane";
        import Modal from "../components/UI/Modal/Modal";
        import axios from "axios";
        import uniqid from "uniqid";


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
            // getCardData
            // assertArraysAligned
            // initCards
            // cardPositionInArray
            // getCardData
            // assertArraysAligned 
        class TrelloBoard extends Component {
        constructor(props) {
            super(props);
        }

        state = {
            cardModal: false,
            modalTitle: "default",
            modalStatus: "default",
            modalStatusNumber: -1,
            cards: [[], [], [], [], []], // this should actually be lanes?
            lanes: [],
            idArray: [],
            dataArray: [],
            laneArray: [[], [], [], [], []]
        };

        titles = ["Open", "In progress", "To be tested", "Re-opened", "Closed"];
        colors = ["open", "progress", "test", "reopened", "closed"];

        componentDidUpdate() {}
        
        componentDidMount() {
            this.db_loadCards();
        }
        
        setModalTitle = name => {
            this.setState({ modalTitle: name });
        };

        setModalStatus = status => {
            this.setState({ modalStatus: status });
        };

        closeModalHandler = () => {
            this.setState({ cardModal: false });
        };

        openModalHandler = () => {
            this.setState({ cardModal: true });
        };

     

        // titles = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];
        statusToLaneNumber(status) {
            return this.titles.indexOf(status);
        }

        processLoadedCards(loadedData) {
            const idArray = [];
            const laneArray = [[], [], [], [], []];
            const dataArray = [];
            var dataArrayItem = [];
            
            for (const dataItem of loadedData) {
            
                dataArrayItem = [];
                dataArrayItem.push(dataItem._id);

                // data.push("item");
                dataArrayItem.push(dataItem.name);
                dataArrayItem.push(dataItem.status);
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

        getCardStatus = id => {
            let c = 0;
            let col = -1;
            for (const l of this.state.laneArray) {
            for (const item of l) {
                const itemString = item + "";
                if (itemString == id) {
                col = c;
                return this.titles[col];
                }
            }
            c++;
            }
        };

        cardClickedHandler = id => {
            const cardPos = this.cardPositionInArray(id);
            const data = this.getCardData(cardPos);
            const cardStatus = this.getCardStatus(id);

            this.setModalTitle(data);
            this.setModalStatus(cardStatus);

            this.openModalHandler();
        };

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
            const storeId = uniqid();
            
                const laneArray = [...this.state.laneArray];
                const idArray = [...this.state.idArray];
                const dataArray = [...this.state.dataArray];
                idArray.push(storeId);
                laneArray[lane].push(storeId);
                const dataToStore = [];

                dataToStore.push(storeId); dataToStore.push(cardText);
                dataArray.push(dataToStore);
                this.setState({ laneArray: [...laneArray] });

                this.setState({ idArray: [...idArray] });
                    this.setState({ dataArray: [...dataArray] },
                       () => {
                            this.db_createCard(storeId)
                        });                         
        }

        render() {
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

                >
                {oneLaneCards}
                </Lane>
            );
            renderLanes.push(lane);
            c++;
            }

            return (
            <div className="wrapper">
                {renderLanes}
                <Modal
                show={this.state.cardModal}
                modalClosed={this.closeModalHandler}
                status={this.state.modalStatus}
                title={this.state.modalTitle}
                color={this.state.modalStatusNumber}
                ></Modal>
            </div>
            );
        }

////////////////////////////////////// db methods ////////////////////////

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
            const cardPos = this.cardPositionInArray(id);
            const cardData = this.getCardData(cardPos);

            const status = this.getCardStatus(id);  
         
              const instance = axios.create({
                baseURL: 'http://localhost:8080',
                headers: {'Authorization': "Bearer " + window.localStorage.getItem("login-token")}
              });

            instance
            .post("/bugs", {
              name: cardData, status: status
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
                const data = " Name: " + this.getCardData(cardPos);
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
