import React from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Switch,
  Modal,
  Form,
  Input,
  Tabs,
  InputNumber,
  DatePicker,
  Select
} from "antd";
import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";
import { generatKey, findCellByKey, array2Object } from "@/utils/sheet.js";
import CellForm from "./CellForm.js";
import { mapping } from "./DataEditor.js";
import { connect } from "dva";
const mapStateToProps = state => ({
  grid: state["sheet"]
});

// 报表基本信息
class BasicInfoSheet extends React.Component {
  state = {
    grid: this.props.grid.BasicInfoSheet,
    selected: null
  };

  handleFormChange = values => {
    const { i, j } = this.state.selected.start;
    const grid = this.state.grid.map(row => [...row]);
    grid[i][j] = { ...grid[i][j], ...values };
    // 检查expr并更新value
    // this.updateCell(grid, i, j)
    this.setState({ grid });
  };

  render() {
    const field =
      this.state.selected &&
      this.state.grid[this.state.selected.start.i][this.state.selected.start.j];
    console.log(this.props.grid);
    return (
      <Card>
        <p>表格标识： BIS</p>
        <Button
          onClick={() =>
            this.props.dispatch({
              type: "sheet/updateSheet",
              payload: { BasicInfoSheet: this.state.grid }
            })
          }
        >
          保存
        </Button>
        <Row>
          <Col span={16}>
            <ReactDataSheet
              key="BasicInfoSheet"
              data={this.state.grid} // array
              valueRenderer={cell => cell.value} // visible by default
              dataRenderer={cell => {
                if (cell.type) {
                  cell.dataEditor = mapping(cell.type.type);
                }
                return cell.expr;
              }} // visible in edit mode
              onCellsChanged={changes => {
                // callback
                console.log(changes);
                const grid = this.state.grid.map(row => [...row]);
                changes.forEach(({ cell, row, col, value }) => {
                  grid[row][col] = { ...grid[row][col], value };
                  return grid;
                  if (typeof value !== "string")
                    grid[row][col] = { ...grid[row][col], value };
                  else {
                    grid[row][col] = { ...grid[row][col], value, expr: value };
                    // 检查expr并更新value
                    // this.updateCell(grid, row, col)
                  }
                });
                this.setState({ grid });
              }}
              valueViewer={props => (
                <div
                  key={props.key}
                  style={{
                    width: "150px",
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
              onSelect={selected => this.setState({ selected })}
            />
          </Col>
          <Col span={8}>
            {field && (
              <CellForm
                {...field}
                id={field.key}
                onChange={this.handleFormChange}
              />
            )}
          </Col>
        </Row>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(BasicInfoSheet);
