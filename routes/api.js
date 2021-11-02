"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const puzzleValidity = solver.validatePuzzle(puzzle);

    if (puzzleValidity !== "valid") {
      return res.json(puzzleValidity);
    }

    const coordinateValidity = solver.validateCoordinate(coordinate);

    if (coordinateValidity !== "valid") {
      return res.json(coordinateValidity);
    }

    const valueValidity = solver.validateValue(value);

    if (valueValidity !== "valid") {
      return res.json(valueValidity);
    }

    const conflict = [];
    const [row, col] = coordinate.split("");
    const [rowIndex, colIndex] = solver.getRowAndColIndices(row, col);
    const grid = solver.generateGrid(puzzle);

    const rowPlacementValidity = solver.checkRowPlacement(
      grid,
      rowIndex,
      colIndex,
      value
    );
    if (rowPlacementValidity === "invalid") {
      conflict.push("row");
    }

    const colPlacementValidity = solver.checkColPlacement(
      grid,
      rowIndex,
      colIndex,
      value
    );
    if (colPlacementValidity === "invalid") {
      conflict.push("column");
    }

    const regionPlacementValidity = solver.checkRegionPlacement(
      grid,
      rowIndex,
      colIndex,
      value
    );
    if (regionPlacementValidity === "invalid") {
      conflict.push("region");
    }

    if (conflict.length) {
      return res.json({ valid: false, conflict });
    }
    res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const puzzleValidity = solver.validatePuzzle(puzzle);

    if (puzzleValidity !== "valid") {
      return res.json(puzzleValidity);
    }

    const solution = solver.solve(puzzle);
    res.json(solution);
  });
};
