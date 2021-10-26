"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle.trim() || !coordinate.trim() || !value.trim()) {
      return res.json({ error: "Required field(s) missing" });
    }
  });

  app.route("/api/solve").post((req, res) => {
    try {
      if (!req.body.hasOwnProperty("puzzle")) {
        return res.json({ error: "Required field missing" });
      }
      const { puzzle } = req.body;

      const reponseString = solver.validate(puzzle);

      if (reponseString !== "Valid puzzle string") {
        return res.json({ error: reponseString });
      }

      const solution = solver.solve(puzzle);
      if (solution === "Puzzle cannot be solved") {
        return res.json({ error: solution });
      }
      return { solution };
    } catch (error) {
      res.json({ error: "An error has occurred" });
    }
  });
};
