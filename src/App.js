import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

const ROWS = 50;
const COLS = 50;

const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

function App() {
  const [grid, setGrid] = useState(generateGrid(ROWS, COLS));
  const [on, setOn] = useState(false);

  const randomize = useCallback(() => {
    setGrid(grid.map(row => row.map(_ => (Math.random() > 0.8 ? 1 : 0))));
  }, [grid]);

  const simulateNextGeneration = useCallback(() => {
    setGrid(grid => {
      const newGrid = [];
      for (let i = 0; i < grid.length; i++) {
        const row = [];
        for (let j = 0; j < grid[i].length; j++) {
          let totalNeighbors = 0;
          neighbors.forEach(([x, y]) => {
            const neighborRow = [i + x];
            const neighborCol = [j + y];
            if (
              neighborRow > -1 &&
              neighborRow < grid.length &&
              neighborCol > -1 &&
              neighborCol < grid[i].length
            ) {
              const neighbor = grid[neighborRow][neighborCol];
              totalNeighbors = totalNeighbors + neighbor;
            }
          });

          if (grid[i][j]) {
            if (totalNeighbors < 2 || totalNeighbors > 3) {
              row.push(0);
            } else {
              row.push(1);
            }
          } else {
            if (totalNeighbors === 3) {
              row.push(1);
            } else {
              row.push(0);
            }
          }
        }

        newGrid.push(row);
      }

      return newGrid;
    });
  }, []);

  const handleCellClick = useCallback((x, y) => {
    setGrid(grid => {
      const newGrid = [...grid];
      newGrid[x][y] = grid[x][y] ? 0 : 1;
      return newGrid;
    });
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(generateGrid(ROWS, COLS));
  }, []);

  useEffect(() => {
    if (on) {
      const simInterval = setInterval(simulateNextGeneration, 200);
      return () => {
        clearInterval(simInterval);
      };
    }
  }, [on, simulateNextGeneration]);

  return (
    <div style={{ padding: "1em" }}>
      <button onClick={randomize}>Randomize</button>
      <button onClick={simulateNextGeneration}>Next generation</button>
      <button onClick={clearGrid}>Clear</button>
      <button onClick={() => setOn(!on)}>{on ? "Stop" : "Start"}</button>
      <Grid grid={grid} handleCellClick={handleCellClick} />
    </div>
  );
}

export default App;

function Grid({ grid, handleCellClick }) {
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(${grid[0].length}, auto)`
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <Cell
            key={j}
            cellValue={cell}
            coordinate={[i, j]}
            handleCellClick={handleCellClick}
          />
        ))
      )}
    </div>
  );
}

function Cell({ cellValue, coordinate, handleCellClick }) {
  return (
    <div
      style={{
        height: 15,
        width: 15,
        backgroundColor: cellValue
          ? `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)})`
          : "transparent",
        border: "1px solid black",
        margin: "-1px 0 0 -1px"
      }}
      onClick={() => handleCellClick(...coordinate)}
    ></div>
  );
}

function generateGrid(rows, cols) {
  const grid = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    grid.push(row);
  }

  return grid;
}
