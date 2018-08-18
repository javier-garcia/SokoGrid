import React from 'react';
import redSelector from '../assets/RedSelector';
import selector from '../assets/Selector';

function Goal(props) {
    return (
        <img src={props.complete ? selector : redSelector} style={{
            gridRowStart: props.row,
            gridColumnStart: props.column,
            order: props.row 
        }} />
    );
}

export default Goal;