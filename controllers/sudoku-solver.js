class SudokuSolver {
  validate(puzzleString) {
    if (/[^1-9\.]/.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }

    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    return "Valid puzzle string";
  }

  generateLabels() {
    const rowAndColLabels = [];
    const rowLabels = "ABCDEFGHI";
    const colLabels = "123456789";
    for (const rowLabel of rowLabels) {
      for (const colLabel of colLabels) {
        rowAndColLabels.push(rowLabel + colLabel);
      }
    }
    return rowAndColLabels;
  }

  generateGrid(puzzleString, rowAndColLabels) {
    const grid = {};
    for (let idx = 0; idx < rowAndColLabels.length; idx++) {
      grid[rowAndColLabels[idx]] = puzzleString[idx];
    }
    return grid;
  }

  generateUnits(rowAndColLabels) {
    const units = {};

    const board = [];
    for (let idx = 0; idx < rowAndColLabels.length; idx += 9) {
      const row = rowAndColLabels.slice(idx, idx + 9);
      for (const square of row) {
        units[square] = [row];
      }
      board.push(row);
    }

    const boxes = [];
    for (let row = 0; row < board.length; row += 3) {
      const boxRows = board.slice(row, row + 3);
      const topmostRow = boxRows[0];
      for (let col = 0; col < topmostRow.length; col += 3) {
        const box = [];
        for (const boxRow of boxRows) {
          box.push(...boxRow.slice(col, col + 3));
        }
        boxes.push(box);
      }
    }
    for (const box of boxes) {
      for (const square of box) {
        units[square].push(box);
      }
    }

    const topmostRow = board[0];
    for (let col = 0; col < topmostRow.length; col++) {
      const column = [];
      for (const row of board) {
        column.push(row[col]);
      }
      for (const square of column) {
        units[square].push(column);
      }
    }
    return units;
  }

  generatePeers(units) {
    const peers = {};
    for (const square in units) {
      for (const unit of units[square]) {
        const uniquePeers = [...new Set([...unit[0], ...unit[1], ...unit[2]])];
        for (let idx = 0; idx < uniquePeers.length; idx++) {
          if (square === peerSquare[idx]) {
            uniquePeers.splice(idx, 1);
            peers[square] = uniquePeers;
            break;
          }
        }
      }
    }
    return peers;
  }
  isValid(puzzleString, row, column, value) {
    const grid = this.generateGrid(puzzleString);
    const units = this.generateUnits(grid);
    const peers = this.generatePeers(units);
    for (const square of peers[`${row}${column}`]) {
      if (grid[square] === `${value}`) return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    return true;
  }

  solve(puzzleString) {
    return puzzleString;
  }
}

module.exports = SudokuSolver;
