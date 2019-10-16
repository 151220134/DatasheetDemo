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
  Select
} from "antd";
import { connect } from "dva";
import ReactDataSheet from "react-datasheet";
// Be sure to include styles at some point, probably during your bootstrapping
import "react-datasheet/lib/react-datasheet.css";
import { SketchPicker } from "react-color";

const mapStateToProps = state => ({
  grid: state["sheet"]
});

const options = ["select", "button", "input"];

class TypeField extends React.Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <Select defaultValue={value} onChange={value => onChange(value)}>
        {options.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

class CellForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props);
    return (
      <Form>
        <Form.Item label="key">
          <p>{this.props.key}</p>
          {/* {getFieldDecorator("key", {
            rules: [{ required: true, message: "key is required!" }],
            validateTrigger: "onChange"
          })(<Input />)} */}
        </Form.Item>
        <Form.Item label="value">
          {getFieldDecorator("value", {})(<Input />)}
        </Form.Item>
        <Form.Item label="expr">
          {getFieldDecorator("expr", {})(<Input />)}
        </Form.Item>
        <Form.Item label="editable">
          {getFieldDecorator("editable", {
            valuePropName: "checked",
            initialValue: "true"
          })(<Switch />)}
        </Form.Item>
        <Form.Item label="type">
          {getFieldDecorator("type", {})(<TypeField />)}
        </Form.Item>
        {/* <Form.Item label="background color">
          {getFieldDecorator("bgcolor", {
            valuePropName: "color"
          })(<SketchPicker />)}
        </Form.Item> */}
      </Form>
    );
  }
}

CellForm = Form.create({
  mapPropsToFields(props) {
    return {
      key: Form.createFormField({
        ...props.key,
        value: props.key
      }),
      value: Form.createFormField({
        ...props.value,
        value: props.value
      }),
      expr: Form.createFormField({
        ...props.expr,
        value: props.expr
      }),
      editable: Form.createFormField({
        ...props.editable,
        value: props.editable === undefined ? true : props.editable
      }),
      type: Form.createFormField({
        ...props.type,
        value: props.type
      })
      // bgcolor: Form.createFormField({
      //   ...props.bgcolor,
      //   value: props.bgcolor
      // })
    };
  },
  // onFieldsChange(props, changedFields, allFields) {
  //     console.log(props, changedFields, allFields)
  // },
  onValuesChange(props, changedValues, allValues) {
    console.log(props, allValues);
    props.form.validateFields(err => {
      if (!err) {
        // console.info('success');
        props.onChange(allValues);
      }
    });
  }
})(CellForm);

class SheetTemplateEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: this.props.grid,
      selected: null
    };
  }

  handleSubmit = () => {
    this.props.dispatch({
      type: "sheet/updateGrid",
      grid: this.state.grid
    });
  };

  handleFormChange = values => {
    const { i, j } = this.state.selected.start;
    const grid = this.state.grid.map(row => [...row]);
    grid[i][j] = { ...grid[i][j], ...values };
    this.setState({ grid });
  };

  render() {
    const field =
      this.state.selected &&
      this.state.grid[this.state.selected.start.i][this.state.selected.start.j];
    return (
      <Card>
        <Row>
          <Col span={12}>
            <ReactDataSheet
              data={this.state.grid} // array
              valueRenderer={cell => cell.value} // visible by default
              dataRenderer={cell => cell.expr} // visible in edit mode
              onCellsChanged={changes => {
                // callback
                console.log(changes);
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
              onSelect={selected => this.setState({ selected })}
            />
          </Col>
          <Col span={12}>
            {this.state.selected && (
              <p>
                正在编辑第{this.state.selected.start.i + 1}行第
                {this.state.selected.start.j + 1}列
              </p>
            )}
            <CellForm {...field} onChange={this.handleFormChange} />
          </Col>
        </Row>
        <Button onClick={this.handleSubmit}>保存</Button>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(SheetTemplateEditor);
