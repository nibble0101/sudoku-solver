const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzlesAndSolutions = require("../controllers/puzzle-strings.js");

chai.use(chaiHttp);

const puzzle = puzzlesAndSolutions[2][0];
const solution = puzzlesAndSolutions[2][1];

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.solution, solution);
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Required field missing");
        done();
      });
  });
  test("Solve a puzzle with invalid characters", (done) => {
    const invalidPuzzle = puzzle.replace("5", "*");
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Solve a puzzle with incorrect length", (done) => {
    const invalidPuzzle = `${puzzle}.2`;
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Solve a puzzle that cannot be solved", (done) => {
    const puzzleArray = puzzle.split("");
    puzzleArray[79] = "5";
    const invalidPuzzle = puzzleArray.join("");

    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test("Check a puzzle placement with all fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "I7", value: "5" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.valid, true);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "F7", value: "8" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.containsAllKeys(body, ["valid", "conflict"]);
        assert.equal(body.valid, false);
        assert.isArray(body.conflict);
        assert.equal(body.conflict.length, 1);
        assert.equal(body.conflict[0], "region");

        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "I8", value: "9" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.containsAllKeys(body, ["valid", "conflict"]);
        assert.equal(body.valid, false);
        assert.isArray(body.conflict);
        assert.equal(body.conflict.length, 2);
        assert.equal(body.conflict[0], "row");
        assert.equal(body.conflict[1], "column");

        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "I7", value: "2" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.containsAllKeys(body, ["valid", "conflict"]);
        assert.equal(body.valid, false);
        assert.isArray(body.conflict);
        assert.equal(body.conflict.length, 3);
        assert.equal(body.conflict[0], "row");
        assert.equal(body.conflict[1], "column");
        assert.equal(body.conflict[2], "region");

        done();
      });
  });
  test("Check a puzzle placement with missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Required field(s) missing");
        done();
      });
  });
  test("Check a puzzle placement with invalid characters", (done) => {
    const invalidPuzzle = puzzle.replace("5", "*");
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidPuzzle, coordinate: "I1", value: "3" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Check a puzzle placement with incorrect length", (done) => {
    const invalidPuzzle = `${puzzle}.2`;
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidPuzzle, coordinate: "I1", value: "3" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "K7", value: "3" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Invalid coordinate");
        done();
      });
  });
  test("Check a puzzle placement with invalid placement value", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "I1", value: "0" })
      .end((err, res) => {
        const { body } = res;
        assert.equal(res.status, 200);
        assert.isObject(body);
        assert.equal(body.error, "Invalid value");
        done();
      });
  });
});
