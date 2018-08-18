import React from "react";
import ReactDOM from "react-dom";
import Board from './Board';

const Index = () => {
  return (
     <Board />
  );
};

ReactDOM.render(<Index />, document.getElementById('app'));