import React from 'react';
import './table.css';

import SingleBlock from "../singleBlock/singleBlock.view";

const Table = (props) => {

    const cells = [];

    for (var i = 0; i < props.cells; i++) {
        cells.push(i);
    }
    var row,
        column = 0;

    if (!props.row) {
        row = 0;
    } else {
        row = props.row;
    }

    if (!props.columns) {
        column = 10;
    } else {
        column = props.columns;
    }

    // function getContent() {     for(var i=0; i<6; i++) {         return (
    // <tr>                 {cells.map((item) => <SingleBlock key={item}
    // color={props.color} row={i} column={item}/>       )}             </tr>     }
    // }

    return (
        <table className="table data-table">
            <tbody>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 0}
                        column={item - column}/>)}
                </tr>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 1}
                        column={item - column}/>)}
                </tr>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 2}
                        column={item - column}/>)}
                </tr>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 3}
                        column={item - column}/>)}
                </tr>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 4}
                        column={item - column}/>)}
                </tr>
                <tr>
                    {cells.map((item) => <SingleBlock
                        {...props}
                        key={item}
                        color={props.color}
                        row={row - 5}
                        column={item - column}/>)}
                </tr>
                {/* <tr>
                        {cells.map((item) =>
                            <SingleBlock key={item} color={props.color} row={row - 5} column={item - column }/>
                        )}
                    </tr> */}
            </tbody>
        </table>
    )
}

export default Table;