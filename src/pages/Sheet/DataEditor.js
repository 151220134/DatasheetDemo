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
import moment from "moment";

export const mapping = type =>
  new Map([
    ["string", StringEditor],
    ["number", NumberEditor],
    ["boolean", BooleanEditor],
    ["default", null]
  ]).get(type || "default");

export class BooleanEditor extends React.Component {
  render() {
    const { cell, value, onChange } = this.props;
    // return new Map([
    //   [
    //     "中文",
    //     <Select
    //       style={{ width: "100%" }}
    //       value={value}
    //       onChange={newValue => onChange(newValue)}
    //       getPopupContainer={triggerNode => triggerNode.parentNode}
    //     >
    //       <Select.Option key="是" value="是">
    //         是
    //       </Select.Option>
    //       <Select.Option key="否" value="否">
    //         否
    //       </Select.Option>
    //     </Select>
    //   ],
    //   [
    //     "English",
    //     <Select
    //       value={value}
    //       onChange={newValue => onChange(newValue)}
    //       getPopupContainer={triggerNode => triggerNode.parentNode}
    //     >
    //       <Select.Option key="Yes" value="Yes">
    //         Yes
    //       </Select.Option>
    //       <Select.Option key="No" value="No">
    //         No
    //       </Select.Option>
    //     </Select>
    //   ]
    // ]).get(cell.type.language || "中文");
    return (
      <Switch
        checked={new Map([["是", true], ["否", false]]).get(value)}
        onChange={checked =>
          onChange(new Map([[true, "是"], [false, "否"]]).get(checked))
        }
      />
    );
  }
}

export class NumberEditor extends React.Component {
  render() {
    const { cell, value, onChange } = this.props;
    return (
      <InputNumber
        style={{ width: "100%" }}
        value={value} //{Number(value).toFixed(2)}
        {...cell.type}
        onChange={newValue => this.props.onChange(newValue)}
      />
    );
  }
}

export class StringEditor extends React.Component {
  render() {
    const { cell, value, onChange } = this.props;
    if (cell.type.enum) {
      const options = JSON.parse(cell.type.enum);
      return (
        <Select
          style={{ width: "100%" }}
          value={value}
          onChange={newValue => onChange(newValue)}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {options.map(item => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
        // <Select
        //     autoFocus
        //     openOnFocus
        //     closeOnSelect
        //     value={this.props.value}
        //     onChange={opt => this.props.onChange(opt.value)}
        //     // onInputKeyDown={this.handleKeyDown}
        //     options={options.map(item => ({ label: item, value: item}))}
        // />
      );
    }

    if (cell.type.format === "date") {
      const date = (value && moment(value, "YYYY-MM-DD")) || moment();
      return (
        <DatePicker
          value={date}
          onChange={(date, dateString) => onChange(dateString)}
          getCalendarContainer={triggerNode => triggerNode.parentNode}
        />
      );
    }

    return null;
  }
}
