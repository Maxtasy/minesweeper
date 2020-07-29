const gameContainer = document.querySelector(".game-container");
const newgameButtom = document.querySelector(".new-game-button");

const COLS = 50;
const ROWS = 25;
const CELL_SIZE = 20;
const MINES = [];
const MINES_COUNT = 200;

function pickRandomCells() {
    for (let i = 0; i < MINES_COUNT; i++) {
        let x;
        let y;
        while (MINES.some(mine => mine[0] === x && mine[1] === y) || x === undefined && y === undefined) {
            x = Math.floor(Math.random() * COLS);
            y = Math.floor(Math.random() * ROWS);
        }
        MINES.push([x, y]);
    }
}

function getMineCount(x, y) {
    let mineCount = 0;

    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            if (i < 0 || i > ROWS - 1 || j < 0 || j > COLS - 1 || (i === y && j === x)) continue;

            if (MINES.some(mine => mine[0] === j && mine[1] === i)) {
                mineCount++;
            }
        }
    }
    
    return (mineCount > 0) ? mineCount : null;
}

function buildGrid() {
    gameContainer.innerHTML = "";

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-x", x);
            cell.setAttribute("data-y", y);
            cell.setAttribute("data-flagged", false);

            if (MINES.some(mine => mine[0] === x && mine[1] === y)) {
                cell.setAttribute("data-mine", true);
                // cell.textContent = "💣";
            } else {
                const mineCount = getMineCount(x, y);
                if (mineCount) cell.setAttribute("data-minecount", mineCount);
            }

            gameContainer.appendChild(cell);
        }
    }

    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("mouseup", (e) => {
            if (e.button === 2 && !e.target.classList.contains("revealed")) {
                toggleFlag(e.target);
            } else if (e.button === 0 && e.target.dataset.flagged === "false") {
                revealCell(e.target);
            }
        });
    });
}

function revealMines() {
    document.querySelectorAll("[data-mine=true]").forEach(cell => {
        cell.textContent = "💣";
        cell.classList.add("revealed");
    });
}

function revealCell(cell) {
    cell.classList.add("revealed");
    if (cell.dataset.minecount) cell.textContent = cell.dataset.minecount;

    if (!cell.dataset.mine && !cell.dataset.minecount) {
        revealSurroundingCells(cell);
    } else if (cell.dataset.mine) {
        revealMines();
        console.log("game over")
    }
}

function toggleFlag(cell) {    
    if (cell.dataset.flagged == "true") {
        cell.textContent = "";
        cell.setAttribute("data-flagged", false);
    } else if (cell.dataset.flagged == "false") {
        cell.textContent = "🚩";
        cell.setAttribute("data-flagged", true);
    }
}

function revealSurroundingCells(cell) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            if (i < 0 || i > ROWS - 1 || j < 0 || j > COLS - 1 || (j === x && i === y)) continue;

            const neighBour = document.querySelector(`[data-x='${j}'][data-y='${i}']`);
            if (!neighBour.dataset.mine && !neighBour.classList.contains("revealed") && neighBour.dataset.flagged === "false") {
                revealCell(neighBour);
            }
        }
    }
}

function newGame() {
    MINES.length = 0;
    pickRandomCells();
    buildGrid();
}

document.addEventListener('contextmenu', e => e.preventDefault());

newgameButtom.addEventListener("click", newGame);

newGame();