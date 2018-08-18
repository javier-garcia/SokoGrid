import React, { Component } from 'react';
import MainCharacter from './MainCharacter';
import Star from './Star';
import Goal from './Goal';

// import grassBlock from '../assets/Grass_Block';
import plainBlock from '../assets/Plain_Block';
import grassBlock from '../assets/Grass_Block';
import wallBlock from '../assets/Wall_Block_Tall';
import rock from '../assets/Rock';
import treeShort from '../assets/Tree_Short'


import data from '../levels.json';

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            row: 2,
            column: 3,
            level: 0,
            columns: 1,
            rows: 1,
            cells: [],
            decorators: [],
            goals: [],
            stars: []
        };

        this.movingStar = null;
        
        this.onKeyUp = this.onKeyUp.bind(this);
        this.canPlayerMove = this.canPlayerMove.bind(this);
        this.getCells = this.getCells.bind(this);
        this.isThereAWall = this.isThereAWall.bind(this);
        this.isThereAGoal = this.isThereAGoal.bind(this);
        this.canStarMove = this.canStarMove.bind(this);
    }

    componentDidMount() {
        this.getCells();
        this.getDecorators();

        window.onkeyup = this.onKeyUp;
    }

    onKeyUp(event) {
        let column = this.state.column;
        let row = this.state.row;
        let stars = this.state.stars;
        let goals = this.state.goals;
        let direction = '';

        switch(event.keyCode) {
            case 37: // left
                if(this.state.column > 1) {
                    column = this.state.column - 1;
                    direction = 'left';
                }
                break;
            case 38: // up
                if(this.state.row > 1) {
                    row = this.state.row - 1;
                    direction = 'up';
                }
                break;
            case 39: // right
                if(this.state.column < this.state.columns) {
                    column = this.state.column + 1;
                    direction = 'right';
                }
                break;
            case 40: // down
                if(this.state.row < this.state.rows) {
                    row = this.state.row + 1;
                    direction = 'down';
                }
                break;
            default:
                // do nothing
        }

        if(this.canPlayerMove(row, column, direction)) {
            if(this.movingStar != null) {
                let indexOfGoal = this.isThereAGoal(this.movingStar.nextStarRow, this.movingStar.nextStarColumn)
                if(indexOfGoal >= 0) {
                    goals = this.state.goals.map((goal, index) => {
                        if(index == indexOfGoal) {
                            return(<Goal key={'goal_' + this.movingStar.nextStarRow + '-' + this.movingStar.nextStarColumn} column={this.movingStar.nextStarColumn} row={this.movingStar.nextStarRow} complete={true} />);
                        }

                        return goal;
                    });

                    stars = this.state.stars.filter((star, index) => {
                        return (index != this.movingStar.indexOfStarAtPlace);
                    });
                } else {
                    stars = this.state.stars.map((star, index) => {
                        if(index == this.movingStar.indexOfStarAtPlace) {
                            return(<Star key={'star_' + this.movingStar.nextStarRow + '-' + this.movingStar.nextStarColumn} column={this.movingStar.nextStarColumn} row={this.movingStar.nextStarRow} />);
                        }

                        return star;
                    });
                }
                this.movingStar = null;
            }

            this.setState({
                row,
                column,
                stars,
                goals
            });
        }
    }

    canPlayerMove(row, column, direction) {
        // What happens if I ask whatIsThere and return 0 == nothing; 1 == wall; 2 == star?
        if(this.isThereAWall(row, column)) {
            return false;
        }

        let indexOfStarAtPlace = this.isThereAStar(row, column);

        if(indexOfStarAtPlace >= 0) {
            let nextStarRow = -1;
            let nextStarColumn = -1;
            switch(direction) {
                case 'left':
                    nextStarRow = row;
                    nextStarColumn = column - 1;
                    break;
                case 'up':
                    nextStarRow = row - 1;
                    nextStarColumn = column;
                    break;
                case 'right':
                    nextStarRow = row;
                    nextStarColumn = column + 1;
                    break;
                case 'down':
                    nextStarRow = row + 1;
                    nextStarColumn = column;
                    break;
                default:
                    // do nothing
            }

            if(!this.canStarMove(nextStarRow, nextStarColumn)) {
                return false;
            }

            this.movingStar = {
                indexOfStarAtPlace,
                nextStarRow,
                nextStarColumn
            }

        }

        return true;
    }

    isThereAStar(row, column) {
        let indexOfStarAtPlace = -1;

        for(let i = 0; i < this.state.stars.length; i++) {
            if(this.state.stars[i].props.row == row && this.state.stars[i].props.column == column) {
                indexOfStarAtPlace = i;
            }
        }

        return indexOfStarAtPlace;
    }

    canStarMove(row, column) {
        let cellIndex = ((row - 1) * this.state.columns) + (column - 1);
        
        if(this.state.cells[cellIndex].props.src == wallBlock) {
            return false;
        }

        return true;
    }

    isThereAWall(row, column) {
        let cellIndex = ((row - 1) * this.state.columns) + (column - 1);
        
        return(this.state.cells[cellIndex].props.src == wallBlock);
    }

    isThereAGoal(row, column) {
        let indexOfGoaltPlace = -1;

        for(let i = 0; i < this.state.goals.length; i++) {
            if(this.state.goals[i].props.row == row && this.state.goals[i].props.column == column) {
                indexOfGoaltPlace = i;
            }
        }

        return indexOfGoaltPlace;
    }

    getCells() {
        let mapDataString = '';
        let image = null;
        let column = -1;
        let row = -1;
        let playerColumn = -1;
        let playerRow = -1;
        let levelData = data[this.state.level];
        let decoratorRandom = -1;

        let columns = levelData.map_data[0].length;
        let rows = levelData.map_data.length;

        let cells = [];
        let decorators = [];
        let goals = [];
        let stars = [];
    
        for(let i = 0; i < levelData.map_data.length; i++) {
            mapDataString += levelData.map_data[i];
        }

        for(let i = 0; i < columns * rows; i++) {
            row = parseInt(i / columns) + 1;
            column = i % columns + 1;

            image = plainBlock;

            switch(mapDataString.charAt(i)) {
                case '_':
                    image = grassBlock;
                    decoratorRandom = Math.random();
                    if(decoratorRandom < 0.3) {
                        decorators.push(<img key={'_' + row + '-' + column} style={{
                            gridColumnStart: column,
                            gridRowStart: row,
                            order: row
                        }} src={rock} />);
                    } else if(decoratorRandom < 0.6){
                        decorators.push(<img key={'_' + row + '-' + column} style={{
                            gridColumnStart: column,
                            gridRowStart: row,
                            order: row
                        }} src={treeShort} />);
                    }
                    break;
                case '#':
                    image = wallBlock;
                    break;
                case '.':
                    goals.push(<Goal key={'goal_' + row + '-' + column} column={column} row={row} />);
                    break;
                case '@':
                    playerColumn = column;
                    playerRow = row;
                    break;
                case '$':
                    stars.push(<Star key={'star_' + row + '-' + column} column={column} row={row} />);
                    break;
                default:
                    //do nothing
            }

            cells.push(<img key={'_' + row + '-' + column} style={{
                    gridColumnStart: column,
                    gridRowStart: row,
                    order: row
                }} src={image} />
            );
        }

        this.setState({
            columns,
            rows,
            column: playerColumn,
            row: playerRow,
            cells,
            decorators,
            goals,
            stars
        });
    }

    getDecorators() {
        this.state.cells.map(cell => {
            if(cell.props.src == grassBlock) {

            }
        });
    }

    render() {
        return (
            <div className='grid' style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(' + this.state.columns + ', 50px)',
                gridTemplateRows: 'repeat(' + this.state.rows + ', 42px)'}}
            >
                {this.state.cells}
                {this.state.decorators}
                {this.state.goals}
                {this.state.stars}
                <MainCharacter column={this.state.column} row={this.state.row} />
            </div>   
        );
    }
}

export default Board;