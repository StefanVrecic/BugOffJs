import React from 'react';
import './Lane.css';
import LaneContents from './LaneContents';
import LaneTitle from './LaneTitle';
import Space from './Space';


const Lane = ( props ) => {
    return (
        <div className= "box" ondrop="drop(event)" ondragover="allowDrop(event)" >
            <LaneTitle color={props.color}>{props.title}</LaneTitle>
                <Space/>
    <LaneContents>
        {props.children}
     </LaneContents>
        </div>
    );
};

export default Lane;





