import React from 'react';
import catGirl from '../assets/catGirl';

function MainCharacter(props) {
    return (
        <img src={catGirl} style={{
            gridRowStart: props.row,
            gridColumnStart: props.column,
            order: props.row
        }} />
    );
}

export default MainCharacter;