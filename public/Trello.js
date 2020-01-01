
// const axios = require('axios');

const columns_nodelist = document.querySelectorAll('.box');
const columns = Array.from(columns_nodelist);
const cards = [ [], [], [], [], []];
const DROP_COLOUR = "#BFC0C2";
var dragged;

// clear column of all cards
function clearColumnCards(column) { 
    // alert(column.innerHTML);
   const columnCards = column.getElementsByClassName("box-contents")[0];
    columnCards.innerHTML = '';
}


columns.forEach(c => {
    // clearColumnCards(c);
});

// add cards to array
columns.forEach(c => {
    const columnIndex = columns.indexOf(c);
    const columnCards_nodelist = c.getElementsByClassName("box-contents--card");
    const columnCards = Array.from(columnCards_nodelist);
    
    columnCards.forEach(card => cards[columnIndex].push(card));
    // add each box-contents-card to cards array
})

function renderColumnCards(column) {
    const columnIndex = columns.indexOf(column);

    // this is where I want to insert the cards
    const columnCardsInsertion = column.getElementsByClassName("box-contents")[0];
    const columnCards_nodelist = cards[columnIndex];

    const columnCards = Array.from(columnCards_nodelist);

    // before end?
    columnCards.forEach(card => columnCardsInsertion.insertAdjacentElement('beforeend', card));
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
}


document.addEventListener('dragend', function(event) {
    // reset the transparency
  event.target.style.opacity = "";
    console.log("drageend");
    console.log(event.target);
});


   
   document.addEventListener("dragenter", function(event) {
    // highlight potential drop target when the draggable element enters it
    // check that it's not the same box
    if (event.target.className == "box") {
      event.target.style.background = DROP_COLOUR;
    }

  
  }, false);
  
  document.addEventListener("dragleave", function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className == "box") {
      event.target.style.background = "";
    }
  
  }, false);

  function getColumn(e) {

  }
document.addEventListener('drop', function(event) {
    event.preventDefault();
    
    if (event.target.className == "box") {
        event.target.style.background = "";
      }

    const targetColumnIndex = columns.indexOf(event.target);
    // console.log(targetColumnIndex);
    
    if (targetColumnIndex === dragged.col) {
        return;
    } // dragging and dropping onto same column
    
    // otherwise transfer data
    // alert(dragged.col +" ... " + dragged.index);
    const cardDrag = cards[dragged.col].splice(dragged.index, 1);
    cards[targetColumnIndex].push(cardDrag[0]);

    // re-render column that card was dragged from
    clearColumnCards(columns[dragged.col]);
    renderColumnCards(columns[dragged.col]);

    // re-render column that card was dragged TO
    clearColumnCards(columns[targetColumnIndex]);
    renderColumnCards(columns[targetColumnIndex]);
    
    
    
})

document.addEventListener('dragstart', function(event) {
    dragged = event.target;
    event.target.style.opacity = .5;
    event.stopPropagation();
    // get column of card 
    const target = event.target;
    let i = -1;
    let col = -1;
    let success = false;
    let index = -1;

    loop1:
    for (c of cards) {
    loop2:
        col++;
        index=-1;
        for (element of c) {
                index++;
            if (target == element)  {
                success = true;
                break loop1;
            }
        }
    }

    dragged.col = col;
    dragged.index = index;

    console.log(col, index);
});
// }));

columns.forEach(e => e.addEventListener('click', function(event) {
    const target = event.target;
    const classes = target.classList;
    const classesString = (JSON.stringify(classes)); // cleaner implementation lol?
    const columnIndex = columns.indexOf(e);

    if (classesString.includes("droppable")) {
        deleteCard(target, columnIndex, e);
    } else if (!classesString.includes("box-title")) {
        addCard(columnIndex);
        clearColumnCards(e);
        renderColumnCards(e);
    }
    
}));

function deleteCard(target, columnIndex, e) {
    
    // find card to delete
    const deleteCardIndex = cards[columnIndex].indexOf(target); 
    
    const deleteCard = cards[columnIndex][deleteCardIndex];
    
    // delete card
    cards[columnIndex].splice(deleteCardIndex, 1);
    console.log(cards[columnIndex]);
    // re-render
    clearColumnCards(e);
    renderColumnCards(e);
}

function countCards() {
    let count = 0;
    for (c of cards) {
        for (element of c) {
            count++;
        }
    }
    return count;
}

let num = 1;

function addCard(columnIndex) { 
     addUser();
    const htmlText = `test-test-${num++}`
    const element = document.createElement("div");
    element.classList.add("droppable");
    element.classList.add("box-contents--card");
    element.setAttribute("draggable", "true");
    
    element.innerText = htmlText; 
    
    const boxElement = columns[columnIndex];
    const boxElementContents = boxElement.getElementsByClassName("box-contents")[0];
    cards[columnIndex].push(element); 
    
    boxElementContents.insertAdjacentElement('beforeend', element);
}

function columnClicked(e) {

}
var index = 1;
function addUser() {

    const data = { name: 'example', email: `fetchTest${index++}@gmail.com`, password: "123123123" };

fetch('/users', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

    return console.log("adduser??");

   
}


// axios.post('/users', {
//     "name": "axiosTestName",
//     "email": "axios@gmail.com",
//     "password": "123123123"
// }, {
//     proxy: { port: 3000 }
// }
// ).then(function (response) {
//     console.log(response);
// })
// .catch(function (error) {
//     console.log(error.config.data);
// });