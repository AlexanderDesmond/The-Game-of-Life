// Initialise the canvas
const CANVAS = document.querySelector("canvas");
const CONTEXT = CANVAS.getContext("2d");

// Set the resolution and dimensions of the canvas.
const RESOLUTION = 40;
CANVAS.width = 400;
CANVAS.height = 400;

// Set the number of rows and columns
const COLUMNS = CANVAS.width / RESOLUTION;
const ROWS = CANVAS.height / RESOLUTION;

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
  grid = nextGeneration(grid);
  render(grid);
  requestAnimationFrame(update);
}

// Return a two-dimensional array to hold the grid.
function buildGrid() {
  //return new Array(COLUMNS).fill(null).map(() => new Array(ROWS).fill(0));
  return new Array(COLUMNS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

// Render the grid on the canvas.
function render(grid) {
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      const cell = grid[column][row];

      CONTEXT.beginPath();
      CONTEXT.rect(
        column * RESOLUTION,
        row * RESOLUTION,
        RESOLUTION,
        RESOLUTION
      );
      CONTEXT.fillStyle = cell ? "black" : "white";
      CONTEXT.fill();
      CONTEXT.stroke();
    }
  }
}

// Build the next generation of the grid.
function nextGeneration(grid) {
  // Create a copy of the grid
  const nextGen = grid.map(arr => [...arr]);

  // Iterate through every cell in the grid.
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      const cell = grid[column][row];

      let numOfNeighbours = 0;
      // Iterate through the neighbours of the current cell.
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          // Don't count the current cell as a neighbour of itself.
          if (i === 0 && j === 0) {
            continue;
          }

          const x_cell = column + i;
          const y_cell = row + j;

          // Check to ensure the cell is actually in the grid.
          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLUMNS && y_cell < ROWS) {
            const currentNeighbour = grid[column + i][row + j];

            // Store the number of neighbours
            numOfNeighbours += currentNeighbour;
          }
        }
      }

      // Implement game rules:
      if (cell === 1 && numOfNeighbours < 2) {
        nextGen[column][row] = 0; // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      } else if (cell === 1 && numOfNeighbours > 3) {
        nextGen[column][row] = 0; // Any live cell with more than three live neighbours dies, as if by overpopulation.
      } else if (cell === 0 && numOfNeighbours === 3) {
        nextGen[column][row] = 1; // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      }
    }
  }

  return nextGen;
}
