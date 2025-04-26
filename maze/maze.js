"use strict";

/*
 * Name: 신현서
 * Date: 2025-04-26
 * Section: IAB 6068
 *
 * This file implements the Maze game: generate random maze, move player, and detect success.
 */

window.addEventListener("load", init);

function init() {
  createMaze();
  document.addEventListener("keydown", handleKey);

  const restartBtn = document.getElementById("restart-button");
  restartBtn.addEventListener("click", createMaze);
}

function createMaze() {
  const mazeContainer = document.getElementById("maze-container");
  mazeContainer.innerHTML = ""; // 혹시 기존에 있던 거 다 지우기

  // 2D 배열로 미로 정의 (0: 길, 1: 벽, S: 출발지, E: 도착지)
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

  // 미로를 화면에 렌더링
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
        cell.id = "player"; // 출발지에 player 배치
      } else if (maze[i][j] === "E") {
        cell.classList.add("end");
      }

      // 좌표 저장 (나중에 이동할 때 쓸 수도 있어)
      cell.dataset.row = i;
      cell.dataset.col = j;

      mazeContainer.appendChild(cell);
    }
  }
}

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
    return; // 방향키가 아니면 무시
  }

  // 새 좌표로 이동 가능한지 체크
  const nextCell = document.querySelector(
    `[data-row='${row}'][data-col='${col}']`
  );
  if (!nextCell) {
    // 범위 벗어나면 무시
    return;
  }
  if (nextCell.classList.contains("wall")) {
    // 벽이면 이동 금지
    return;
  }

  // 이동
  player.removeAttribute("id"); // 기존 플레이어 표시 지우기
  nextCell.id = "player"; // 새 위치에 플레이어 표시

  // 도착지인지 확인
  if (nextCell.classList.contains("end")) {
    alert("성공! 미로를 탈출했습니다");
  }
}
