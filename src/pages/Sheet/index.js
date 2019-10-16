import React from "react";
import { Card, Tabs } from "antd";
import BasicInfoSheet from "./BasicInfoSheet";

export default class App extends React.Component {
  render() {
    return (
      <Card style={{ width: "100%", height: "500px" }}>
        <Tabs>
          <Tabs.TabPane tab="报表基本信息" key="1">
            <BasicInfoSheet />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
