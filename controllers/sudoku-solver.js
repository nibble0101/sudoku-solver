const rowLabels = "ABCDEFGHI";
const colLabels = "123456789";
const digits = colLabels;
const invalidChar = /[^1-9\.]/;

class SudokuSolver {
  validatePuzzle(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (invalidChar.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return "valid";
  }

  validateCoordinate(coordinate) {
    if (coordinate.trim().length !== 2) {
      return { error: "Invalid coordinate" };
    }
    const [row, col] = coordinate.split("");
    if (!rowLabels.includes(row) || !colLabels.includes(col)) {
      return { error: "Invalid coordinate" };
    }

    return "valid";
  }
  validateValue(value) {
    if (!colLabels.includes(value)) {
      return { error: "Invalid value" };
    }
    return "valid";
  }
  generateGrid(puzzleString) {
    const grid = [];
    for (let idx = 0; idx < puzzleString.length; idx += 9) {
      const row = puzzleString.slice(idx, idx + 9).split("");
      grid.push(row);
    }
    return grid;
  }
  getRowAndColIndices(row, col) {
    const rowIndex = rowLabels.indexOf(row);
    const colIndex = +col - 1;
    return [rowIndex, colIndex];
  }
  checkRowPlacement(grid, rowIndex, colIndex, value) {
    const gridRow = grid[rowIndex];
    for (let idx = 0; idx < gridRow.length; idx++) {
      if (idx === colIndex) {
        continue;
      }
      if (gridRow[idx] === value) {
        return "invalid";
      }
    }
    return "valid";
  }

  checkColPlacement(grid, rowIndex, colIndex, value) {
    for (let idx = 0; idx < grid.length; idx++) {
      if (idx === rowIndex) {
        continue;
      }
      if (grid[idx][colIndex] === value) {
        return "invalid";
      }
    }
    return "valid";
  }

  _getRange(index) {
    if (index < 3) return [0, 3];
    if (index < 6) return [3, 6];
    return [6, 9];
  }

  checkRegionPlacement(grid, rowIndex, colIndex, value) {
    const [rowStart, rowEnd] = this._getRange(rowIndex);
    const [colStart, colEnd] = this._getRange(colIndex);
    for (let i = rowStart; i < rowEnd; i++) {
      for (let j = colStart; j < colEnd; j++) {
        if (i === rowIndex && j === colIndex) {
          continue;
        }
        if (grid[i][j] === value) {
          return "invalid";
        }
      }
    }

    return "valid";
  }
  _findEmptySquare(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === ".") {
          return [row, col];
        }
      }
    }
    return false;
  }

  _validate(grid, rowIndex, colIndex, val) {
    const rowValidity = this.checkRowPlacement(grid, rowIndex, colIndex, val);
    if (rowValidity === "invalid") return false;

    const colValidity = this.checkColPlacement(grid, rowIndex, colIndex, val);
    if (colValidity === "invalid") return false;

    const regionValidity = this.checkRegionPlacement(
      grid,
      rowIndex,
      colIndex,
      val
    );
    if (regionValidity === "invalid") return false;

    return true;
  }
  _solve(grid) {
    const emptySquare = this._findEmptySquare(grid);
    if (!emptySquare) return true;

    const [rowIndex, colIndex] = emptySquare;

    for (const digit of digits) {
      if (this._validate(grid, rowIndex, colIndex, digit)) {
        grid[rowIndex][colIndex] = digit;
        if (this._solve(grid)) return true;
        grid[rowIndex][colIndex] = ".";
      }
    }

    return false;
  }

  solve(puzzleString) {
    const grid = this.generateGrid(puzzleString);
    const solution = this._solve(grid);
    if (!solution) return { error: "Puzzle cannot be solved" };
    const rowStrings = grid.map((rowArr) => rowArr.join(""));
    return { solution: rowStrings.join("") };
  }
}

module.exports = SudokuSolver;
