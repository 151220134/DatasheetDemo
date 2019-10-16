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
import {
  generatKey,
  findCellByKey,
  array2Object,
  type2Component
} from "@/utils/sheet.js";
import CellForm from "./CellForm.js";
import { mapping } from "./DataEditor.js";

// 报表基本信息
class IncomeSheet extends React.Component {
  state = {
    grid: generatKey([
      [
        { value: "客户名称", expr: null, readOnly: true },
        { value: "XX有限责任公司", expr: null, readOnly: true },
        { value: "客户编号", expr: null, readOnly: true },
        { value: "ZL00000004", expr: null, readOnly: true }
      ],
      [
        { value: "是否审计", expr: null, readOnly: true },
        { value: "否", expr: null, type: { type: "boolean" } },
        { value: "审计日期", expr: null, readOnly: true },
        { value: "2019-10-15", expr: null }
      ],
      [
        { value: "审计意见", expr: null, readOnly: true },
        { value: null, expr: null },
        { value: "审计报告编号", expr: null, readOnly: true },
        {
          value: null,
          expr: null,
          type: {
            type: "string",
            enum: JSON.stringify(["1001", "1002"])
          }
        }
      ]
    ]),
    selected: null
  };

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
    if (expr.charAt(0) !== "=") {
      return { ...changeCell, className: "", value: expr, expr: expr };
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope);
      } catch (e) {
        value = null;
      }
      if (value !== null && this.validateExp([key], expr, state)) {
        return { ...changeCell, className: "equation", value, expr };
      } else {
        return { ...changeCell, className: "error", value: "error", expr: "" };
      }
    }
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

  updateCell = (grid, row, col) => {
    if (value.charAt(0) !== "=") return grid;
    const scope = array2Object(grid);
    const changeCell = grid[row][col];
    grid[row][col] = this.computeExpr(changeCell, scope, grid); //_.assign({}, changeCell, this.computeExpr(changeCell, expr, scope, state))

    grid.forEach((row, index) =>
      row.forEach((cell, key) => {
        if (
          cell.expr &&
          cell.expr.charAt(0) === "=" &&
          cell.expr.indexOf(changeCell.key) > -1 &&
          key !== changeCell.key
        ) {
          state = this.cellUpdate(state, index, key);
        }
      })
    );
    return state;
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

    return (
      <Card>
        <Row>
          <Col span={18}>
            <ReactDataSheet
              key="IncomeSheet"
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
                const grid = this.state.grid.map(row => [...row]);
                changes.forEach(({ cell, row, col, value }) => {
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
          <Col span={6}>
            {field && <CellForm {...field} onChange={this.handleFormChange} />}
          </Col>
        </Row>
      </Card>
    );
  }
}

export default IncomeSheet;
