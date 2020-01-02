    import React, { Component } from 'react';
    import './TrelloBoard.css';
    import Card from '../components/Lane/Card';
    import Lane from '../components/Lane/Lane';
    import Modal from '../components/UI/Modal/Modal';
    import Axios from 'axios';

//     import Backend from '../../API/index'; 
//     Backend.connectBack();

    class TrelloBoard extends Component {

        state = {
            cardModal: true,
            modalTitle: "default"
        }

        setModalTitle = (name) => {
            this.setState({modalTitle : name});
        }

        closeModalHandler = () => {
            this.setState({cardModal : false}); 
        }

        cardClickedHandler = (name) => {
            this.setModalTitle(name);
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
        cards = [ [], [], [], [], []];
        DROP_COLOUR = "#BFC0C2";
        // this is where I want to call my API!


        render () {
                // this.axiosConnect();
            return (

                    <div className="wrapper">
                <Modal show = {this.state.cardModal} modalClosed = {this.closeModalHandler} status="In Progress"
                    title={this.state.modalTitle}>
                </Modal>

    <Lane color={this.colors[0]}  title={this.titles[0]}>
            <Card clicked = {this.cardClickedHandler} >Column 1 card 1</Card>
            <Card clicked = {this.cardClickedHandler} >Column 1 card 2</Card>
    </Lane>

    <Lane color={this.colors[1]} title={this.titles[1]}>
        <Card clicked = {this.cardClickedHandler} >Column 2 card 1</Card>
        <Card clicked = {this.cardClickedHandler} >Column 2 card 2</Card>
        <Card clicked = {this.cardClickedHandler} >Column 2 card 3</Card>
        <Card clicked = {this.cardClickedHandler} >Column 2 card 4</Card>
    </Lane>

    <Lane color={this.colors[2]} title={this.titles[2]}>
            <Card clicked = {this.cardClickedHandler} >Column 3 card 1</Card>
    </Lane>

    <Lane color={this.colors[3]} title={this.titles[3]}>
                <Card clicked = {this.cardClickedHandler} >Column 4 Card 1</Card>
    </Lane>

    <Lane color={this.colors[4]} title={this.titles[4]}>
            <Card clicked = {this.cardClickedHandler} >Column 5 Card 1</Card>
    </Lane>

    </div>
            );
        }
    }

    export default TrelloBoard;

//     connectBack() {
//         const data = { name: 'example', email: `fetchTestBlahBlah@gmail.com`, password: "123123123" };
//         console.log(data);
//         fetch('http://localhost:8080/users', {
//             method: 'POST', // or 'PUT'
//             headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         // alert("success");
//         console.log('Success:', data);
// })
// .catch((error) => {
//         // alert("failure");
//         console.error('Error:', error);
//         });
//     }
