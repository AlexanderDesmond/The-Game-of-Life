// Initialise the canvas
const CANVAS = document.querySelector("canvas");
const CONTEXT = CANVAS.getContext("2d");

// Set the resolution and dimensions of the canvas.
const RESOLUTION = 5;
CANVAS.width = 900;
CANVAS.height = 900;

// Set the number of rows and columns
const COLUMNS = CANVAS.width / RESOLUTION;
const ROWS = CANVAS.height / RESOLUTION;

let mode: boolean = false;

// Class for holding the states of a cell
class Cell {
  currentState: number;
  total: number;
  constructor() {
    this.currentState = Math.floor(Math.random() * 2);
    this.total = 0;
  }

  setState(state: number) {
    this.currentState = state;
    this.total += state;
  }
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
  grid = nextGeneration(grid);
  render(grid);
  requestAnimationFrame(update);
}

// Return a two-dimensional array to hold the grid.
function buildGrid() {
  return new Array(COLUMNS)
    .fill(null)
    .map(() => new Array(ROWS).fill(null).map(() => new Cell()));
}

// Render the grid on the canvas.
function render(grid: Cell[][]) {
  // Find and store the
  let maxTotal = 0;
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      const cell = grid[column][row];

      if (cell.total > maxTotal) {
        maxTotal = cell.total;
      }
    }
  }

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

      styleGrid(cell, maxTotal);
    }
  }
}

// Handles styling the grid
function styleGrid(cell: Cell, maxTotal: number) {
  // Black / White version
  if (!mode) {
    CONTEXT.fillStyle = cell.currentState ? "black" : "white";
  }
  // Heatmap version
  else if (mode) {
    const normalised = cell.total / maxTotal;
    const h = (1.0 - normalised) * 240;
    CONTEXT.fillStyle = `hsl(${h}, 100%, 50%)`;
  }

  CONTEXT.fill();
}

// Build the next generation of the grid.
function nextGeneration(grid: Cell[][]) {
  // Create a copy of the grid
  const currentGen = grid.map(arr => arr.map(cell => cell.currentState));

  // Iterate through every cell in the grid.
  for (let column = 0; column < currentGen.length; column++) {
    for (let row = 0; row < currentGen[column].length; row++) {
      const cell = currentGen[column][row];

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
            const currentNeighbour = currentGen[column + i][row + j];

            // Store the number of neighbours
            numOfNeighbours += currentNeighbour;
          }
        }
      }

      // Implement game rules:
      switch (cell) {
        case 1:
          if (numOfNeighbours < 2) {
            grid[column][row].setState(0); // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          } else if (numOfNeighbours > 3) {
            grid[column][row].setState(0); // Any live cell with more than three live neighbours dies, as if by overpopulation.
          }
          break;
        case 0:
          if (numOfNeighbours === 3) {
            grid[column][row].setState(1); // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          }
          break;
        default:
          grid[column][row].setState(grid[column][row].currentState); // Any live cell with two or three live neighbours lives on to the next generation.
      }
    }
  }

  return grid;
}

function onBlackAndWhiteClick() {
  mode = false;
}

function onHeatmapClick() {
  mode = true;
}

function onModeChange() {
  mode = !mode;
}
