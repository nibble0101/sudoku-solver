const chai = require("chai");
const assert = chai.assert;
const puzzlesAndSolutions = require("../controllers/puzzle-strings.js");

const Solver = require("../controllers/sudoku-solver.js");

const solver = new Solver();

const puzzle = puzzlesAndSolutions[2][0];
const solution = puzzlesAndSolutions[2][1];
const grid = solver.generateGrid(puzzle);

suite("UnitTests", () => {
  test("Handles valid puzzle string of 81 characters", (done) => {
    const response = solver.validatePuzzle(puzzle);
    assert.isString(response);
    assert.equal(response, "valid");
    done();
  });
  test("Handles puzzle string with invalid characters", (done) => {
    const invalidPuzzle = puzzle.replace("5", "*");
    const response = solver.validatePuzzle(invalidPuzzle);
    assert.isObject(response);
    assert.equal(response.error, "Invalid characters in puzzle");
    done();
  });
  test("Handles puzzle string not 81 characters in length", (done) => {
    const invalidPuzzle = `${puzzle}.2`;
    const response = solver.validatePuzzle(invalidPuzzle);
    assert.isObject(response);
    assert.equal(response.error, "Expected puzzle to be 81 characters long");
    done();
  });
  test("Handles a valid row placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("D", "5");
    const response = solver.checkRowPlacement(grid, rowIndex, colIndex, "7");
    assert.isString(response);
    assert.equal(response, "valid");
    done();
  });
  test("Handles an invalid row placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("D", "5");
    const response = solver.checkRowPlacement(grid, rowIndex, colIndex, "8");
    assert.isString(response);
    assert.equal(response, "invalid");
    done();
  });
  test("Handles a valid column placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("C", "9");
    const response = solver.checkColPlacement(grid, rowIndex, colIndex, "2");
    assert.isString(response);
    assert.equal(response, "valid");
    done();
  });
  test("Handles an invalid column placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("C", "9");
    const response = solver.checkColPlacement(grid, rowIndex, colIndex, "8");
    assert.isString(response);
    assert.equal(response, "invalid");
    done();
  });
  test("Handles a valid region (3x3 grid) placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("I", "6");
    const response = solver.checkRegionPlacement(grid, rowIndex, colIndex, "8");
    assert.isString(response);
    assert.equal(response, "valid");
    done();
  });
  test("Handles an invalid region (3x3 grid) placement", (done) => {
    const [rowIndex, colIndex] = solver.getRowAndColIndices("I", "6");
    const response = solver.checkRegionPlacement(grid, rowIndex, colIndex, "3");
    assert.isString(response);
    assert.equal(response, "invalid");
    done();
  });
  test("Valid puzzle strings pass the solver", (done) => {
    const response = solver.solve(puzzle);
    assert.isObject(response);
    assert.equal(response.solution, solution);
    done();
  });
  test("Invalid puzzle strings fail the solver", (done) => {
    const puzzleArray = puzzle.split("");
    puzzleArray[79] = "5";
    const invalidPuzzle = puzzleArray.join("");
    const response = solver.solve(invalidPuzzle);
    assert.isObject(response);
    assert.equal(response.error, "Puzzle cannot be solved");
    done();
  });
  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    const puzzleArray = puzzle.split("");
    puzzleArray[7] = "4";
    puzzleArray[78] = "5";
    const incompletePuzzle = puzzleArray.join("");
    const response = solver.solve(incompletePuzzle);
    assert.isObject(response);
    assert.equal(response.solution, solution);
    done();
  });
});
