import React from 'react';
import star from '../assets/Star';

function Star(props) {
    return (
        <img src={star} style={{
            gridRowStart: props.row,
            gridColumnStart: props.column,
            order: props.row 
        }} />
    );
}

export default Star;