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
import _ from "lodash";
import * as mathjs from "mathjs";
import { generatKey, findCellByKey, array2Object } from "@/utils/sheet.js";
import CellForm from "./CellForm.js";
import { mapping } from "./DataEditor.js";
import { connect } from "dva";
const mapStateToProps = state => ({
  grid: state["sheet"]
});

// 现金流量表
class CashFlowSheet extends React.Component {
  state = {
    grid: this.props.grid.CashFlowSheet,
    selected: null
  };

  componentDidMount() {
    const grid = this.state.grid.map(row => [...row]);
    // 检查expr并更新value
    grid.forEach((row, i) =>
      row.forEach((col, j) => {
        const cell = grid[i][j];
        if (cell.expr) this.updateCell(grid, i, j, cell);
      })
    );
    this.setState({ grid });
  }

  // componentDidUpdate() {
  //   const grid = this.state.grid.map(row => [...row]);
  //   // 检查expr并更新value
  //   grid.forEach((row, i) => row.forEach((col, j) => {
  //     const cell = grid[i][j]
  //     if(cell.expr)
  //     this.updateCell(grid, i, j, cell)
  //   }))
  //   this.setState({ grid });
  // }

  validateExp(trailKeys, expr, state) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        const target = findCellByKey(state, match);
        valid = this.validateExp(
          [...trailKeys, match],
          state[target.i][target.j].expr
        );
      }
    });
    return valid;
  }

  computeExpr(changeCell, scope, state) {
    const { key, expr } = changeCell;
    let value = null;
    // if (expr.charAt(0) !== "=") {
    //   return { ...changeCell, className: "", value: expr, expr: expr };
    // } else {
    try {
      value = mathjs.evaluate(expr.substring(1), scope);
    } catch (e) {
      value = null;
    }
    if (
      value &&
      typeof value !== "object" /*&& this.validateExp([key], expr, state)*/
    ) {
      return {
        ...changeCell,
        className: "equation",
        value: Number(value.toFixed(2)),
        expr
      };
    } else {
      return { ...changeCell, className: "error", value: "error", expr }; //{ ...changeCell, className: "error", value: "error", expr: "" };
    }
    // }
  }

  cellUpdate(state, changeCell, expr) {
    const scope = array2Object(state); //_.mapValues(state, (val) => isNaN(val.value) ? 0 : parseFloat(val.value))
    const updatedCell = this.computeExpr(changeCell, expr, scope, state); //_.assign({}, changeCell, this.computeExpr(changeCell, expr, scope, state))
    // state[changeCell.key] = updatedCell
    const target = findCellByKey(state, changeCell.key);
    // target = { ...updatedCell }
    state[target.i][target.j] = updatedCell;
    state.forEach(row =>
      row.forEach((cell, key) => {
        if (
          cell.expr &&
          cell.expr.charAt(0) === "=" &&
          cell.expr.indexOf(changeCell.key) > -1 &&
          key !== changeCell.key
        ) {
          state = this.cellUpdate(state, cell, cell.expr);
        }
      })
    );
    return state;
  }

  updateCell = (grid, row, col, cell) => {
    const { expr } = cell;
    if (!expr || expr.charAt(0) !== "=") return grid;

    const _grid = this.props.grid;
    const BIS = array2Object(_grid.BasicInfoSheet);
    const BS = array2Object(_grid.BalanceSheet);
    const IS = array2Object(_grid.IncomeSheet);
    const CFS = array2Object(grid);
    const scope = { BIS, BS, IS, CFS }; //array2Object(grid);
    debugger;
    // const changeCell = grid[row][col];
    grid[row][col] = this.computeExpr(cell, scope, grid); //_.assign({}, changeCell, this.computeExpr(changeCell, expr, scope, state))
    // debugger
    // grid.forEach((row, index) =>
    //   row.forEach((col, key) => {
    //     if (
    //       col.expr &&
    //       col.expr.charAt(0) === "=" &&
    //       col.expr.indexOf(cell.key) > -1 &&
    //       key !== cell.key
    //     ) {
    //       grid = this.updateCell(grid, index, key);
    //     }
    //   })
    // );
    return grid;
  };

  handleFormChange = values => {
    const { i, j } = this.state.selected.start;
    const grid = this.state.grid.map(row => [...row]);
    grid[i][j] = { ...grid[i][j], ...values };
    // 检查expr并更新value
    this.updateCell(grid, i, j, grid[i][j]);
    this.setState({ grid });
  };

  render() {
    const field =
      this.state.selected &&
      this.state.grid[this.state.selected.start.i][this.state.selected.start.j];

    return (
      <Card>
        <p>表格标识： CFS</p>
        <Button
          onClick={() =>
            this.props.dispatch({
              type: "sheet/updateSheet",
              payload: { CashFlowSheet: this.state.grid }
            })
          }
        >
          保存
        </Button>
        <Row>
          <Col span={16}>
            <ReactDataSheet
              key="CashFlowSheet"
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
                  if (typeof value !== "string") {
                    grid[row][col] = { ...grid[row][col], value };
                  } else {
                    // changes中的value不分value和expr
                    grid[row][col] = { ...grid[row][col], value, expr: value };
                    // 检查expr并更新value
                    this.updateCell(grid, row, col, grid[row][col]);
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

export default connect(mapStateToProps)(CashFlowSheet);
