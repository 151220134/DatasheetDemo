import React from "react";
import { Card } from "antd";
import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";
import "./index.css";

const grid = [
  [{ value: 1 }, { value: "abcdefgh" }],
  [{ value: 2 }, { value: "abcdefgh" }],
  [{ value: 3 }, { value: "abcdefgh" }],
  [{ value: 4 }, { value: "abcdefgh" }],
  [{ value: 5 }, { value: "abcdefgh" }],
  [{ value: 6 }, { value: "abcdefgh" }]
];
export default class FixedHead extends React.Component {
  render() {
    return (
      <Card>
        <ReactDataSheet
          key="FixedHeadSheet"
          data={grid}
          valueRenderer={cell => cell.value}
          sheetRenderer={props => (
            <table>
              <thead>
                <tr>
                  <th>fixed head 1</th>
                  <th>fixed head 2</th>
                  {/* {columns.map(col => (<th>{col.name}</th>))} */}
                </tr>
              </thead>
              <tbody>{props.children}</tbody>
            </table>
          )}
        />
      </Card>
    );
  }
}
