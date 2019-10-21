import React from "react";
import { Card, Tabs } from "antd";
import BasicInfoSheet from "./BasicInfoSheet";
import BalanceSheet from "./BalanceSheet";
import IncomeSheet from "./IncomeSheet";
import CashFlowSheet from "./CashFlowSheet";

export default class App extends React.Component {
  render() {
    return (
      <Card style={{ width: "100%", height: "750px" }}>
        <Tabs>
          <Tabs.TabPane tab="报表基本信息" key="1">
            <BasicInfoSheet />
          </Tabs.TabPane>
          <Tabs.TabPane tab="资产负债表" key="2">
            <BalanceSheet />
          </Tabs.TabPane>
          <Tabs.TabPane tab="利润表" key="3">
            <IncomeSheet />
          </Tabs.TabPane>
          <Tabs.TabPane tab="现金流量表" key="4">
            <CashFlowSheet />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
