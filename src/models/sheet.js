export default {
  namespace: "sheet",
  state: [
    [
      { key: "a1", value: null, expr: null },
      { key: "a2", value: null, expr: null },
      { key: "a3", value: null, expr: null }
    ],
    [
      { key: "b1", value: null, expr: null },
      { key: "b2", value: null, expr: null },
      { key: "b3", value: null, expr: null }
    ],
    [
      { key: "c1", value: null, expr: null },
      { key: "c2", value: null, expr: null },
      { key: "c3", value: null, expr: null }
    ],
    [
      { key: "d1", value: null, expr: null },
      { key: "d2", value: null, expr: null },
      { key: "d3", value: null, expr: null }
    ]
  ],
  reducers: {
    setState(_, { payload }) {
      return payload;
    }
  },
  effects: {
    *updateGrid({ grid }, { put }) {
      yield put({
        type: "setState",
        payload: grid
      });
    }
  }
};
