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

const GRID = buildGrid();
console.log(GRID);
render(GRID);

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
