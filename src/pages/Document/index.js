import React from "react";
import { Card, Button } from "antd";
import { connect } from "dva";
import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";

const mapStateToProps = state => ({
  grid: state["sheet"]
});

class SheetDocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: this.props.grid.map(row =>
        row.map(cell => {
          return {
            ...cell,
            readOnly: cell.editable === undefined ? false : !cell.editable
          };
        })
      )
    };
  }

  handleSubmit = () => {
    this.props.dispatch({
      type: "sheet/updateGrid",
      grid: this.state.grid
    });
  };

  render() {
    return (
      <Card>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={cell => cell.value}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row]);
            changes.forEach(({ cell, row, col, value }) => {
              grid[row][col] = { ...grid[row][col], value };
            });
            this.setState({ grid });
          }}
          valueViewer={props => (
            <div
              key={props.key}
              style={{
                width: "100px",
                height: "100%",
                textAlign: "center",
                backgroundColor: props.cell.bgcolor
                  ? props.cell.bgcolor.hex
                  : "unset"
              }}
            >
              {props.value}
            </div>
          )}
        />
        <Button onClick={this.handleSubmit}>保存</Button>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(SheetDocumentEditor);
