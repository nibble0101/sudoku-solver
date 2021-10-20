"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle.trim()) {
      return res.json({ error: "Required field missing" });
    }
    if (!solver.validate(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
  });
};
