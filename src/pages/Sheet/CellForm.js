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
  Select,
  Tabs,
  Tooltip,
  Icon,
  InputNumber
} from "antd";
import { options, format } from "@/utils/sheet.js";

class TypeString extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="minLength">
          {getFieldDecorator("minLength", {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="maxLength">
          {getFieldDecorator("maxLength", {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="enum">
          {getFieldDecorator("enum", {})(<Input />)}
        </Form.Item>
        <Form.Item label="format">
          {getFieldDecorator("format", {})(
            <Select>
              {format.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}
TypeString = Form.create({
  mapPropsToFields(props) {
    return {
      minLength: Form.createFormField({
        ...props.minLength,
        value: props.minLength
      }),
      maxLength: Form.createFormField({
        ...props.maxLength,
        value: props.maxLength
      }),
      enum: Form.createFormField({
        ...props.enum,
        value: props.enum
      }),
      format: Form.createFormField({
        ...props.format,
        value: props.format
      })
    };
  },
  onValuesChange(props, changedValues, allValues) {
    props.onChange(allValues);
  }
})(TypeString);

class TypeNumber extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="min">
          {getFieldDecorator("min", {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="max">
          {getFieldDecorator("max", {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="precision">
          {getFieldDecorator("precision", {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="step">
          {getFieldDecorator("step", {})(<InputNumber />)}
        </Form.Item>
      </Form>
    );
  }
}
TypeNumber = Form.create({
  mapPropsToFields(props) {
    return {
      min: Form.createFormField({
        ...props.min,
        value: props.min
      }),
      max: Form.createFormField({
        ...props.max,
        value: props.max
      }),
      precision: Form.createFormField({
        ...props.precision,
        value: props.precision
      }),
      step: Form.createFormField({
        ...props.step,
        value: props.step
      })
    };
  },
  onValuesChange(props, changedValues, allValues) {
    props.onChange(allValues);
  }
})(TypeNumber);

class TypeBoolean extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="language">
          {getFieldDecorator("language", {})(
            <Select>
              <Select.Option key={"中文"} value="中文">
                中文
              </Select.Option>
              <Select.Option key={"English"} value="English">
                English
              </Select.Option>
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}
TypeBoolean = Form.create({
  mapPropsToFields(props) {
    return {
      language: Form.createFormField({
        ...props.language,
        value: props.language
      })
    };
  },
  onValuesChange(props, changedValues, allValues) {
    props.onChange(allValues);
  }
})(TypeBoolean);

class TypeField extends React.Component {
  state = {
    visible: false
  };

  render() {
    const { onChange, disabled } = this.props;
    const value = this.props.value || { type: "string" };

    return (
      <Row>
        <Col span={16}>
          <Select
            value={value.type}
            disabled={disabled}
            onChange={type => onChange({ type })}
          >
            {options.map(option => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Button
            disabled={disabled}
            onClick={() => this.setState({ visible: true })}
          >
            <Icon type="setting" />
          </Button>
        </Col>
        <Modal
          title="Advanced Settings"
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
        >
          <div>{this.mapping(value)}</div>
        </Modal>
      </Row>
    );
  }

  mapping = data => {
    return {
      string: (
        <TypeString
          {...data}
          onChange={values =>
            this.props.onChange({ type: data.type, ...values })
          }
        />
      ),
      number: (
        <TypeNumber
          {...data}
          onChange={values =>
            this.props.onChange({ type: data.type, ...values })
          }
        />
      ),
      boolean: (
        <TypeBoolean
          {...data}
          onChange={values =>
            this.props.onChange({ type: data.type, ...values })
          }
        />
      )
    }[data.type];
  };
}

class CellForm extends React.Component {
  state = {
    readOnly: this.props.readOnly
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { readOnly } = this.state;
    return (
      <Card>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="value">
            {getFieldDecorator("value", {})(<Input disabled={readOnly} />)}
          </Form.Item>
          <Form.Item label="expr">
            {getFieldDecorator("expr", {})(<Input disabled={readOnly} />)}
          </Form.Item>
          <Form.Item label="readOnly">
            {getFieldDecorator("readOnly", {
              valuePropName: "checked"
            })(
              <Switch
                onChange={checked => this.setState({ readOnly: checked })}
              />
            )}
          </Form.Item>
          <Form.Item label="type">
            {getFieldDecorator("type", {})(<TypeField disabled={readOnly} />)}
          </Form.Item>
          {/* <Form.Item label="background color">
            {getFieldDecorator("bgcolor", {
              valuePropName: "color"
            })(<SketchPicker />)}
          </Form.Item> */}
        </Form>
      </Card>
    );
  }
}

export default CellForm = Form.create({
  mapPropsToFields(props) {
    return {
      value: Form.createFormField({
        ...props.value,
        value: props.value
      }),
      expr: Form.createFormField({
        ...props.expr,
        value: props.expr
      }),
      readOnly: Form.createFormField({
        ...props.readOnly,
        value: props.readOnly
      }),
      type: Form.createFormField({
        ...props.type,
        value: props.type
      })
    };
  },
  // onFieldsChange(props, changedFields, allFields) {
  //     console.log(props, changedFields, allFields)
  // },
  onValuesChange(props, changedValues, allValues) {
    props.onChange(allValues);
  }
})(CellForm);
