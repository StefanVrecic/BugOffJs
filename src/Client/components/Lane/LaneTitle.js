import React from 'react';
import './LaneTitle.css';


const LaneTitle = ( props ) => {
    return (
            <div className={ `${props.color} box-title`} >{props.children}</div>
    );
};

export default LaneTitle;
