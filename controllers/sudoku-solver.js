const rowLabels = "ABCDEFGHI";
const invalidChar = /[^1-9\.]/;

class SudokuSolver {
  validate(puzzleString) {
    if (invalidChar.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }

    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    return "Valid puzzle string";
  }

  generateGrid(puzzleString) {
    const grid = [];
    for (let idx = 0; idx < puzzleString.length; idx += 9) {
      const row = puzzleString.slice(idx, idx + 9);
      grid.push(row);
    }
    return grid;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.generateGrid(puzzleString);
    const rowIndex = rowLabels.indexOf(row);
    const colIndex = column - 1;
    const gridRow = grid[rowIndex];
    for (let idx = 0; idx < gridRow.length; idx++) {
      if (idx === colIndex) {
        continue;
      }
      if (gridRow[idx] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.generateGrid(puzzleString);
    const rowIndex = rowLabels.indexOf(row);
    const colIndex = column - 1;
    for (let idx = 0; idx < grid.length; idx++) {
      if (idx === rowIndex) {
        continue;
      }
      if (grid[idx][colIndex] === value) {
        return false;
      }
    }
    return true;
  }
  getRange(index) {
    if (index < 3) return [0, 3];
    if (index < 6) return [3, 6];
    return [6, 9];
  }
  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.generateGrid(puzzleString);
    const rowIndex = rowLabels.indexOf(row);
    const colIndex = column - 1;
    const [rowStart, rowEnd] = this.getRange(rowIndex);
    const [colStart, colEnd] = this.getRange(colIndex);
    for (let i = rowStart; i < rowEnd; i++) {
      for (let j = colStart; j < colEnd; j++) {
        if (i === rowIndex && j === colIndex) {
          continue;
        }
        if (grid[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    return puzzleString;
  }
}

module.exports = SudokuSolver;
