"use strict";

/*
 * Name: 신현서
 * Date: 2025-04-26
 * Section: IAB 6068
 *
 * This file implements the Maze game: maze, move player, and detect success.
 */

window.addEventListener("load", init);

/**
 * Initializes the maze game.
 * Creates the maze, sets up key event listener, and restart button event listener.
 * @returns {void}
 */
function init() {
  createMaze();
  document.addEventListener("keydown", handleKey);

  const restartBtn = document.getElementById("restart-button");
  restartBtn.addEventListener("click", createMaze);
}

/**
 * Generates and renders the maze structure on the webpage.
 * Sets up player start position and maze cell attributes.
 * @returns {void}
 */
function createMaze() {
  const mazeContainer = document.getElementById("maze-container");
  mazeContainer.innerHTML = ""; // Clear previous maze if any

  // 2D array defining the maze layout (0: path, 1: wall, 'S': start, 'E': end)
  const maze = [
    ["S", 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, "E"],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  // Render the maze on the page
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (maze[i][j] === 1) {
        cell.classList.add("wall");
      } else if (maze[i][j] === 0) {
        cell.classList.add("path");
      } else if (maze[i][j] === "S") {
        cell.classList.add("start");
        cell.id = "player"; // Set starting point
      } else if (maze[i][j] === "E") {
        cell.classList.add("end");
      }

      cell.dataset.row = i;
      cell.dataset.col = j;
      mazeContainer.appendChild(cell);
    }
  }
}

/**
 * Handles the keydown event to move the player inside the maze.
 * Updates the player's position based on arrow key input.
 * Displays success message when reaching the end.
 * @param {KeyboardEvent} event - The keyboard event triggered by user input.
 * @returns {void}
 */
function handleKey(event) {
  const player = document.getElementById("player");
  let row = parseInt(player.dataset.row);
  let col = parseInt(player.dataset.col);

  if (event.key === "ArrowUp") {
    row -= 1;
  } else if (event.key === "ArrowDown") {
    row += 1;
  } else if (event.key === "ArrowLeft") {
    col -= 1;
  } else if (event.key === "ArrowRight") {
    col += 1;
  } else {
    return; // Ignore non-arrow keys
  }

  const nextCell = document.querySelector(
    `[data-row='${row}'][data-col='${col}']`
  );
  if (!nextCell) {
    // Out of bounds
    return;
  }
  if (nextCell.classList.contains("wall")) {
    // Can't move into walls
    return;
  }

  player.removeAttribute("id"); // Remove player from current cell
  nextCell.id = "player"; // Move player to next cell

  if (nextCell.classList.contains("end")) {
    alert("성공! 미로를 탈출했습니다");
  }
}
