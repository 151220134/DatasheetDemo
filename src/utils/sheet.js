export const options = ["string", "number", "boolean"];

export const format = ["date"];
// 自动生成key值，行数只能在26以内
export const generatKey = grid =>
  grid.map((row, i) =>
    row.map((cell, j) => {
      return { ...cell, key: `${String.fromCharCode(65 + i)}${String(j + 1)}` };
    })
  );

export const findCellByKey = (grid, key) => {
  for (let i in grid) {
    for (let j in grid[i]) {
      if (grid[i][j].key === key) return { i, j };
    }
  }
  // for (let row of grid) {
  //     for (let col of row) {
  //         if (col.key === key) return col
  //     }
  // }
};

export const array2Object = grid => {
  var obj = {};
  grid.forEach(row =>
    row.forEach(col => {
      const { key, value } = col;
      obj[key] = isNaN(value) ? 0 : parseFloat(value);
    })
  );
  return obj;
};
