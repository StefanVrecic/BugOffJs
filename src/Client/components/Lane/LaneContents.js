import React from 'react';
import './LaneContents.css';


const LaneContents = ( props ) => {
    return (
        <div className="box-contents" >
            {props.children}
        </div>
    );
};

export default LaneContents;
