import { generatKey } from "@/utils/sheet.js";

export default {
  namespace: "sheet",
  state: {
    BasicInfoSheet: generatKey([
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
        {
          value: "2019-10-15",
          expr: null,
          type: { type: "string", format: "date" }
        }
      ],
      [
        { value: "审计意见", expr: null, readOnly: true },
        { value: null, expr: null },
        { value: "审计报告编号", expr: null, readOnly: true },
        {
          value: "1001",
          expr: null,
          type: {
            type: "string",
            enum: JSON.stringify(["1001", "1002"])
          }
        }
      ],
      [
        { value: "审计意见说明", expr: null, readOnly: true },
        { value: null, expr: null, colSpan: 3 }
      ]
    ]),
    BalanceSheet: generatKey([
      [
        { value: "科目编号", expr: null, readOnly: true },
        { value: "科目名称", expr: null, readOnly: true },
        { value: "科目值", expr: null, readOnly: true }
      ],
      [
        { value: "1", expr: null, readOnly: true },
        { value: "流动资产", expr: null, readOnly: true },
        { value: 1005.0, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "2", expr: null, readOnly: true },
        { value: "货币资金", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "3", expr: null, readOnly: true },
        { value: "结算备付金", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "4", expr: null, readOnly: true },
        { value: "拆除资金", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "5", expr: null, readOnly: true },
        { value: "交易性金融资产", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ]
    ]),
    IncomeSheet: generatKey([
      [
        { value: "科目编号", expr: null, readOnly: true },
        { value: "科目名称", expr: null, readOnly: true },
        { value: "科目值", expr: null, readOnly: true }
      ],
      [
        { value: "1", expr: null, readOnly: true },
        { value: "一、营业总收入", expr: null, readOnly: true },
        { value: 805.0, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "2", expr: null, readOnly: true },
        { value: "其中：营业收入", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "3", expr: null, readOnly: true },
        { value: "利息收入", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "4", expr: null, readOnly: true },
        { value: "已赚保费", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ],
      [
        { value: "5", expr: null, readOnly: true },
        { value: "手续费及佣金收入", expr: null, readOnly: true },
        { value: null, expr: null, type: { type: "number", precision: 2 } }
      ]
    ]),
    CashFlowSheet: generatKey([
      [
        { value: "科目编号", expr: null, readOnly: true },
        { value: "科目名称", expr: null, readOnly: true },
        { value: "科目值", expr: null, readOnly: true }
      ],
      [
        { value: "1", expr: null, readOnly: true },
        { value: "一、经营活动产生的现金流量", expr: null, readOnly: true },
        { value: null, expr: "=sqrt(100)+6*4/3" }
      ],
      [
        { value: "2", expr: null, readOnly: true },
        { value: "销售商品、提供劳务收到的现金", expr: null, readOnly: true },
        { value: null, expr: "=BIS.C4+123" }
      ],
      [
        { value: "3", expr: null, readOnly: true },
        { value: "客户存款和同业存放款项净增加额", expr: null, readOnly: true },
        { value: null, expr: "=CFS.C3" }
      ],
      [
        { value: "4", expr: null, readOnly: true },
        { value: "向中央银行借款净增加额", expr: null, readOnly: true },
        { value: null, expr: null }
      ],
      [
        { value: "5", expr: null, readOnly: true },
        { value: "向其他金融机构拆入资金净增加额", expr: null, readOnly: true },
        { value: null, expr: null }
      ]
    ])
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *updateSheet({ payload }, { put }) {
      yield put({
        type: "setState",
        payload
      });
    }
  }
};
