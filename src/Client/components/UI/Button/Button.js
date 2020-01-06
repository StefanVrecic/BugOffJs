import React from 'react';

import './Button.css';

const button = (props) => (
    <button
        type="button"
        disabled={props.disabled}
        className={"btn " + [[props.btnType]].join(' ')}
        onClick={props.clicked}>{props.children}</button>
);

export default button;