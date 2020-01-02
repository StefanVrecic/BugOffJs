import React from 'react';
import './Card.css';


const Card = ( props ) => {
    return (
        <div className="box-contents--card droppable" draggable="true" onClick = { props.clicked}>
        {props.children}
       </div>
    );
};

export default Card;