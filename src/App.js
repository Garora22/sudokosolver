import React, { useState } from 'react';
import './App.css';

function App() {
  const [sudokuGrid, setSudokuGrid] = useState(Array(9).fill(Array(9).fill(0)));

  const isSafe = (row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (sudokuGrid[row][i] === num || sudokuGrid[i][col] === num) {
        return false;
      }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (sudokuGrid[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const empty = () => {
    const newGrid = sudokuGrid.map((row) =>
      row.map((cell) => 0)
    );
    setSudokuGrid(newGrid);
  };
  
  const solveSudoku = () => {
    const grid = [...sudokuGrid];

    if (isValidSudokuInput(grid)) {
      if (solve(grid)) {
        setSudokuGrid(grid);
      } else {
        alert("The Sudoku puzzle is unsolvable.");
      }
    } else {
      alert("Invalid Sudoku input. Please make sure it adheres to the rules.");
    }
  };

  const isValidSudokuInput = (grid) => {
    // Check rows and columns for duplicates
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set();
      const colSet = new Set();
      for (let j = 0; j < 9; j++) {
        if (rowSet.has(grid[i][j]) || colSet.has(grid[j][i])) {
          return false; // Duplicate number found in row or column
        }
        if (grid[i][j] !== 0) rowSet.add(grid[i][j]);
        if (grid[j][i] !== 0) colSet.add(grid[j][i]);
      }
    }

    // Check 3x3 sections for duplicates
    for (let startRow = 0; startRow < 9; startRow += 3) {
      for (let startCol = 0; startCol < 9; startCol += 3) {
        const sectionSet = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cellValue = grid[startRow + i][startCol + j];
            if (sectionSet.has(cellValue)) {
              return false; // Duplicate number found in a 3x3 section
            }
            if (cellValue !== 0) sectionSet.add(cellValue);
          }
        }
      }
    }

    return true;
  };

  const solve = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleCellChange = (row, col, e) => {
    if (e.key === 'Backspace') {
      // Clear the cell when Backspace is pressed
      const newGrid = sudokuGrid.map((r, rowIndex) =>
        r.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? 0 : cell
        )
      );
      setSudokuGrid(newGrid);
    } else {
      const value = parseInt(e.key);

      if (!isNaN(value) && value >= 1 && value <= 9) {
        const newGrid = sudokuGrid.map((r, rowIndex) =>
          r.map((cell, colIndex) =>
            rowIndex === row && colIndex === col ? value : cell
          )
        );
        setSudokuGrid(newGrid);
      }
    }
  };

  return (
    <div className="App">
      <div className="Header">Sudoku Solver</div>
      <div className="SudokuGrid">
        {sudokuGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="SudokuRow">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                className="SudokuCell"
                type="text"
                maxLength="1"
                value={cell || ''}
                onKeyDown={(e) => handleCellChange(rowIndex, colIndex, e)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="Button">
        <button onClick={() => solveSudoku()}>Solve</button>
        <button onClick={() => empty()}>Reset</button>
      </div>
    </div>
  );
}

export default App;
