        // To add a property to what is being tracked in the bug/database, Ctrl+F 'warning' and add new property to list below
        // necessary for 1) tracking 2) creating locally 3) creating in db 4) reading 5) updating
        import React, { Component } from "react";
        import "./TrelloBoard.css";
        import Card from "../components/Lane/Card";
        import Lane from "../components/Lane/Lane";
        import MainModal from "../components/UI/Modal/MainModal";
        import axios from "axios";
        import mongoose from 'mongoose';
        import { connect } from 'react-redux';
        // const port = process.env.PORT;
const port = "http://localhost:8080";
// const port = "https://vrecic-bugoff-api.herokuapp.com";
        
        // import Modal from "../components/UI/Modal/Modal";
        // import uniqid from "uniqid";

        // id, text, status, [description]

            // Methods in file
            // db_loadCards(), statusToLaneNumber, // processLoadedCards,db_updateCardStatus,
            // setModalTitle,setModalStatus, // closeModalHandler,getCardStatus,
            // cardClickedHandler,openModalHandler, // axiosConnect,db_createCard,
            // initCards,cardPositionInArray, // getCardTitle,assertArraysAligned ,
            // const name = data[1];
            // const status = data[2];
            // const description = data[3];
            // const dueDate = data[4];
            // const severity = data[5];
            // const overdueConfirmed = data[6];
            // const activity = data[7];
            // const bugReproducible = data[8];
           

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
          };

          titles = [
            "Open",
            "In progress",
            "To be tested",
            "Re-opened",
            "Closed"
          ];
          colors = ["open", "progress", "test", "reopened", "closed"];
          // warning - track properties
          bugProperties = [
            "id",
            "name",
            "status",
            "description",
            "dueDate",
            "severity",
            "overdueConfirmed",
            "activity",
            "bugReproducible",
            "allow",
            "allowReminder",
            "reminderTimer"
          ];

          componentDidUpdate(prevProps) {
            // Typical usage (don't forget to compare props):
            if (
              this.props.panelCard !== null &&
              this.props.panelCard !== prevProps.panelCard
            ) {
              // issue is the panelCard sticks around after the card is closed and then if the card is opened again
              // this block never occurs
              this.cardClickedHandler(this.props.panelCard);
            }
          }

          componentDidMount() {
            this.db_loadCards();
            // this.processLoadedCards();
          }

          p = title => {
            return this.bugProperties.indexOf(title);
          };

          setAddCardLaneOpen = col => {
            this.setState({ setAddCardLaneOpen: col });
          };

          setModalTitle = name => {
            this.setState({ modalTitle: name });
          };

          setModalStatus = status => {
            this.setState({ modalStatus: status });
          };

          setModalData = data => {
            this.setState({ modalData: data });
            this.props.updateModalData(data); // redux call
          };

          closeModalHandler = () => {
            this.setState({ cardModal: false });
            // don't want any residual data from previous modal. Failsafe.
            this.setModalData([]);
            // this.
          };

          openModalHandler = () => {
            this.setState({ cardModal: true });
          };

          cardPosInLane = id => {
            const laneNumber = this.getCardLane(id);
            return this.state.laneArray[laneNumber].indexOf(id);
          };

          // titles = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];
          statusToLaneNumber(status) {
            return this.titles.indexOf(status+"");
          }
          laneNumberToStatus(lane) {
            return this.titles[lane];
          }

          processLoadedCards(loadedData) {
            const idArray = [];
            const laneArray = [[], [], [], [], []];
            let dataArray = [];
            var dataArrayItem = [];
            // const loadedData2 = this.generateGuestTestData();

            for (const dataItem of loadedData) {
                // alert(dataItem + " ... loop");
              dataArrayItem = [];
              dataArrayItem.push(dataItem._id);

              // name = data[1]; status = [2]; description = [3]; dueDate = [4];
              // severity = [5]; overdueConfirmed = [6]; activity = data[7]; reproducible = data[8]

              // WARNING - read properties - DO NOT CHANGE ORDER OF dataArrayItem.push
              dataArrayItem.push(dataItem.name);
              dataArrayItem.push(dataItem.status);
              dataArrayItem.push(dataItem.description);
              dataArrayItem.push(dataItem.dueDate);
              dataArrayItem.push(dataItem.severity);
              dataArrayItem.push(dataItem.overdueConfirmed);
              dataArrayItem.push(dataItem.activity);
              dataArrayItem.push(dataItem.bugReproducible);
              dataArrayItem.push(dataItem.dueDateEnabled);
              dataArrayItem.push(dataItem.allowReminder);
              dataArrayItem.push(dataItem.reminderTimer);
              //         dataArrayItem.push(dataItem[0]+"");
              //         dataArrayItem.push(dataItem[1] + "");
              //         dataArrayItem.push(dataItem[2] + "");
              //         dataArrayItem.push(dataItem[3]);
              //         dataArrayItem.push(dataItem[4] + "");
              //         dataArrayItem.push(dataItem[5]);
              //         dataArrayItem.push(dataItem[6]);
              //         dataArrayItem.push(dataItem[7] + "");
              //         dataArrayItem.push(dataItem[8]);
              //         dataArrayItem.push(dataItem[9]);
              //         dataArrayItem.push(dataItem[10]);
              //         dataArrayItem.push(dataItem[11]);
              // console.log(dataArrayItem);

              const lane = this.statusToLaneNumber(dataItem.status);
                // const lane = this.statusToLaneNumber(dataItem[2])
                
              idArray.push(dataItem._id);
            // idArray.push(dataItem[0]+"");
              dataArray.push(dataArrayItem);
            // dataArray.push(dataArrayItem);
              laneArray[lane].push(dataItem._id);
              // laneArray[lane].push(dataItem[0]);
            }

            

            console.log(dataArray);
            // redux calls
            this.props.updateIdArray(idArray);
            this.props.updateDataArray(dataArray); // redux call
            this.setState({ laneArray: [...laneArray] });
          }

          sortSeverity(a, b) {
            const c = 5;
            if (a[c] === b[c]) {
              return 0;
            } else {
              if (a[c] === "High") {
                return -1;
              }
              if (b[c] === "High") {
                return 1;
              }
              return a[c] > b[c] ? -1 : 1;
            }
          }

          orderBySeverity = () => {
            const dataArray = [...this.props.dataArray];
            console.log(dataArray.sort(this.sortSeverity) + " new");
          };

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
                  laneContent = laneContent + "\n" + l;
                }
                output = output + laneContent + "\n\n";
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
          };

          getCardStatus = id => {
            return this.titles[this.getCardLane(id)];
          };

          setActiveCard = id => {
            this.setState({ activeCard: id });
          };

          cardClickedHandler = id => {
            const cardPos = this.cardPositionInArray(id);
            const title = this.getCardTitle(cardPos);
            const cardStatus = this.getCardStatus(id);

            const data = this.getCardData(cardPos);

            this.setModalTitle(title);
            this.setModalStatus(cardStatus);
            this.setActiveCard(id);
            this.setModalData(data);

            this.openModalHandler();
          };

          cardPositionInArray(id) {
            const idArray = [...this.props.idArray];
            const index = idArray.indexOf(id);
            return index;
          }

          deleteItem = () => {
            // return;
            const deleteId = this.state.activeCard;
            this.setState({ activeCard: "-1" });

            const idArray = [...this.props.idArray];
            const laneArray = [...this.state.laneArray];
            const dataArray = [...this.props.dataArray];

            const deleteIndex = idArray.indexOf(deleteId);
            const activeCardLane = this.getCardLane(deleteId);

            const indexInLane = laneArray[activeCardLane].indexOf(deleteId);

            idArray.splice(deleteIndex, 1);
            laneArray[activeCardLane].splice(indexInLane, 1);
            dataArray.splice(deleteIndex, 1);

            this.setState({ laneArray: [...laneArray] });

            this.props.updateIdArray([...idArray]);
            this.props.updateDataArray([...dataArray]);

            this.db_deleteItem(deleteId);
            this.closeModalHandler();
          };

          addingCard = col => {
            this.setState({ addCard_laneOpen: col });
          };

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
          saveStatusHandler = (id, status) => {
            // same as changeLane, just handled from Main Modal=
            const destination = this.statusToLaneNumber(status);
            this.changeLane(id, destination);
          };

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

            const status = this.laneNumberToStatus(destination);
            const cardPos = this.cardPositionInArray(id); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("status")] = status; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            //     this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
            // }

            this.setState(
              { laneArray: [...laneArray_temp] },
              this.db_updateCardStatus(id)
            );
          }

          transferCards = (id, dropColumn) => {
            this.changeLane(id, dropColumn);
          };

          addCard = (cardText, lane) => {
            var storeId = mongoose.Types.ObjectId();
            var storeId_string = storeId + "";

            const laneArray = [...this.state.laneArray];
            const idArray = [...this.props.idArray];
            const dataArray = [...this.props.dataArray];
            idArray.push(storeId_string);
            laneArray[lane].push(storeId_string);

            // name = data1[];status=2;description=3;dueDate=4;severity=5;overdueConfirmed= 6;activity=7;reproducible=8;
            // dueDateEnabled=9;
            const status = this.laneNumberToStatus(lane);

            // data for each card - WARNING - create properties: don't change order
            const dataToStore = [
              storeId_string,
              cardText,
              status,
              "No description provided",
              null,
              "None",
              false,
              [],
              "None",
              false,
              false,
              0
            ];
            dataArray.push(dataToStore);

            this.setState({ laneArray: [...laneArray] });
            this.props.updateIdArray([...idArray]);
            this.props.updateDataArray([...dataArray]);

            this.db_createCard(storeId, cardText, status);
          };

          viewActivityNotes = () => {
            if (
              this.props.modalData.length === 0 ||
              this.props.modalData[7].length === 0
            ) {
              return; //
            }
            this.setState({ cardModal: false });
            this.props.viewActivityNotes();
          };

          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                  laneAddCardOpen={this.state.addCard_laneOpen === c}
                  addingCard_lane={this.addingCard}
                >
                  {oneLaneCards}
                </Lane>
              );
              renderLanes.push(lane);
              c++;
            }

            ///////////////////////////////////

            return (
              <div className="wrapper">
                {renderLanes}

                <MainModal
                  show={this.state.cardModal}
                  addDescription={this.saveDescriptionHandler}
                  modalClosed={this.closeModalHandler}
                  addDate={this.saveDateHandler}
                  data={this.state.modalData}
                  addReproducible={this.saveReproducibilityHandler}
                  deleteItemModal={this.deleteItem}
                  addSeverity={this.saveSeverityHandler}
                  title={this.state.modalTitle}
                  status={this.state.modalStatus}
                  color={this.state.modalStatusNumber}
                  postNewNote={this.saveNewNote}
                  viewNotes={this.viewActivityNotes}
                  saveStatus={this.saveStatusHandler}
                  saveCalendarEnabled={this.saveAllowCalendar}
                  saveNewTitle={this.saveNewTitleHandler}
                  saveAllowAlert={this.saveAlertHandler}
                  setReminder={this.saveReminderHandler}
                ></MainModal>
              </div>
            );
          }

          ////////////////////////////////////// Modal save data handlers  ///////////////////////
          saveReminderHandler = reminderTimer => {
            // backend will calculate a date based on x hours before reminder

            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            if (
              dataArray == undefined ||
              dataArray[cardPos] == undefined ||
              dataArray.length === 0
            ) {
              // weird behaviour when escape key is called, no idea why.
              return;
            }
            dataArray[cardPos][this.p("reminderTimer")] = reminderTimer; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveAlertHandler = allowReminder => {
            // xyz
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("allowReminder")] = allowReminder; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveNewTitleHandler = name => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("name")] = name; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveDescriptionHandler = description => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("description")] = description; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };
          saveAllowCalendar = allow => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("allow")] = allow; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };
          saveDateHandler = date => {
            // check to see if in future, if in future  => duedatePassed = false + onst dueDateEnabled = data[9]
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("dueDate")] = date; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveSeverityHandler = severity => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("severity")] = severity; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveNewNote = note => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const now = new Date(); // make a timestamp
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][this.p("activity")].push(
              now + "/timeNoteSplit/" + note
            ); // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          saveReproducibilityHandler = bugReproducible => {
            const cardId = this.state.activeCard;
            const cardPos = this.cardPositionInArray(cardId); // get position in index
            const dataArray = [...this.props.dataArray]; // get relative data
            dataArray[cardPos][8] = bugReproducible; // alter specific property
            this.props.updateDataArray(dataArray); // save to store
            this.db_updateCardData(cardId, dataArray[cardPos]); // save to db
          };

          //////////////////////////////////// db methods ////////////////////////

          db_deleteItem(id) {
            
if (this.props.isGuest) { return; } // disable database calls in guest mode
            const instance = axios.create({
              baseURL: port,
              headers: {
                Authorization:
                  "Bearer " + window.localStorage.getItem("login-token")
              }
            });

            instance
              .delete("/bugs/" + id, {})
              .then(response => {
                console.log("success delete" + response);
              })
              .catch(error => {
                console.log("failure deleting card " + error.config.data);
              });
          }

          db_updateCardData(id, data) {
            
if (this.props.isGuest) { return; } // disable database calls in guest mode
            // warning - update properties. Add in axios.patch() below
            const name = data[1];
            const status = data[2];
            const description = data[3];
            const dueDate = data[4];
            const severity = data[5];
            const overdueConfirmed = data[6];
            const activity = data[7];
            const bugReproducible = data[8];
            const dueDateEnabled = data[9];
            const allowReminder = data[10];
            const reminderTimer = data[11];

            let dueDatePassed = false;
            const now = new Date();
            if (dueDate < now) {
              dueDatePassed = true;
            }

            axios
              .patch(port+`/bugs/${id}`, {
                name,
                description,
                status,
                dueDate,
                severity,
                overdueConfirmed,
                activity,
                bugReproducible,
                dueDateEnabled,
                allowReminder,
                reminderTimer,
                dueDatePassed
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
            
if (this.props.isGuest) { return; } // disable database calls in guest mode
            const status_string = this.getCardStatus(id);

            axios
              .patch(port+`/bugs/${id}`, {
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
            
if (this.props.isGuest) { return; } // disable database calls in guest mode
            const instance = axios.create({
              baseURL: port,
              headers: {
                Authorization:
                  "Bearer " + window.localStorage.getItem("login-token")
              }
            });

            instance
              .post("/bugs", {
                // WARNING - create properties
                _id: id,
                name: cardTitle,
                status: status,
                description: "No description provided",
                dueDate: null,
                severity: "None",
                overdueConfirmed: false,
                notes: null,
                bugReproducible: "None",
                dueDateEnabled: false,
                allowReminder: false,
                reminderTimer: 0
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
              .get(port+"/bugs/", {
                headers: {
                  Authorization:
                    "Bearer " + window.localStorage.getItem("login-token")
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
              .then(() => this.exportData());
          }

          exportData() {
            const time = new Date();
            let content = time + "\n\n";
            const idArray = [...this.props.idArray];

            for (const c of idArray) {
              const stat = " Status: " + this.getCardStatus(c);
              const cardPos = this.cardPositionInArray(c);
              const data = " Name: " + this.getCardTitle(cardPos);
              const exportData = data + "\n" + stat + "\n\n";
              content = content + exportData;
            }
            // alert(content);
            const uriContent =
              "data:application/octet-stream," + encodeURIComponent(content);
            // const newWindow = window.open(uriContent, 'Document');
          }

          generateGuestTestData = () => {
            // use as guest data
            const i0 = [
              ["5e1c6d7025a4c5000017c038"],
              ["Check this one out now for testing"],
              ["Open"],
              ["There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."],
              ["2020-01-14T11:45:00.000Z"],
              ["Medium"],
              ['test'],
              [null],
              [true],
              [false]
            ];
            const i1 = [
              ["5e1c966a4356e7000065014f"],
              ["Card 2"],
              ["In progress"],
              ["No description provided"],
              ["2020-01-14T11:45:00.000Z"],
              ["Medium"],
              [false],
              ["test"],
              ["None"],
              [true],
              [true]
            ];
            const i2 = [
              ["5e1c970d04396b00000974b7"],
              ["Card 4"],
              ["To be tested"],
              ["No description provided"],
              ["2020-01-13T13:00:00.288Z"],
              ["Medium"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i3 = [
              ["5e1c9764fb2a9b00006be15e"],
              ["Card 5"],
              ["To be tested"],
              ["this is a descprion"],
              ["2020-01-13T13:00:00.691Z"],
              ["Low"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i4 = [
              ["5e1ca19c115f56000008b7d2"],
              ["Card 6"],
              ["To be tested"],
              ["No description provided"],
              ["2020-01-09T20:55:00.000Z"],
              ["Low"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i5 = [
              ["5e1ceb81f12120000037deeb"],
              ["Card 7"],
              ["To be tested"],
              ["No description provided"],
              ["2020-01-16T20:59:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i6 = [
              ["5e1cebe1f12120000037deec"],
              ["Card 8"],
              ["To be tested"],
              ["No description provided"],
              ["2020-01-22T20:02:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i7 = [
              ["5e1cebe5f12120000037deed"],
              ["Card 9"],
              ["To be tested"],
              [
                "No description provided No description provided No…n provided No description provided No description"
              ],
              ["2020-01-19T20:06:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i8 = [
              ["5e1cf731f12120000037deee"],
              ["Card 11"],
              ["Re-opened"],
              ["No description provided"],
              ["2020-01-16T20:15:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i9 = [
              ["5e1cf750f12120000037deef"],
              ["Card 3 Card 3 Card 3 Card 3 Card 3 Card 3 Card 3 Card 3 "],
              ["In progress"],
              ["No description provided"],
              ["2020-01-04T20:51:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [true],
              [false]
            ];
            const i10 = [
              ["5e1d10901a6c2000004cdffb"],
              ["Card 12"],
              ["Closed"],
              ["No description provided"],
              [null],
              ["None"],
              [false],
              [[]],
              ["None"],
              [false],
              [false]
            ];
            const i11 = [
              ["5e1d10d616f76500002f57dc"],
              //   ["Card 10 Card 10 Card 10 Card 10 Card 10 Card 10 Card 10 Card 10 Card 10 Card 10 "],
              [
                "Long descrip "
              ],
              ["Open"],
              [
                "12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12312345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 12345 123"
              ],
              ["2020-01-21T20:51:00.000Z"],
              ["None"],
              [false],
              [[]],
              ["None"],
              [false],
              [false]
            ];

            const data = [];
            data.push(i0);
            data.push(i1);
            data.push(i2);
            data.push(i3);
            data.push(i4);
            data.push(i5);
            data.push(i6);
            data.push(i7);
            data.push(i8);
            data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9); data.push(i9);
            data.push(i10);
            data.push(i11);data.push(i11);data.push(i11);data.push(i11);data.push(i11);data.push(i11);data.push(i11);
            return data;
          };
        }

        // now access the redux with this.props.idArray or this.props.dataArray etc
const mapStateToProps = state => {
	return {
		idArray: state.idArray,
		dataArray: state.dataArray,
    modalData: state.modalData,
    isGuest: state.isGuest,
	};
};
// test
// call via this.props.updateIdArray or this.props.updateDataArray
const mapDispatchToProps = dispatch => {
	return {
		updateIdArray: (newArray) => dispatch({type: 'idArray_update', payload: newArray}),
		updateDataArray: (newArray) => dispatch({type: 'dataArray_update', payload: newArray}),
		updateModalData: (newArray) => dispatch({type: 'modalData_update', payload: newArray})
}; 



};


export default connect(mapStateToProps, mapDispatchToProps)(TrelloBoard);