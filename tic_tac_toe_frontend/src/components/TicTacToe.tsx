import { component$, useStore, $ } from "@builder.io/qwik";

/**
 * Color palette for reference (see styling in CSS).
 */

/**
 * Board utilities for Tic Tac Toe
 */
type Cell = "X" | "O" | "";
type Player = "X" | "O";
type GameStatus = "playing" | "draw" | "win";

/**
 * Winning line indices (rows, cols, diagonals)
 */
const WIN_LINES = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

/** 
 * Returns winner info if the board has a winner.
 * Otherwise returns null.
 */
function detectWinner(board: Cell[]): { player: Player; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a] as Player, line };
    }
  }
  return null;
}

/**
 * Checks if all cells are filled (draw)
 */
function isDraw(board: Cell[]): boolean {
  return board.every((cell) => cell !== "");
}

// PUBLIC_INTERFACE
export const TicTacToe = component$(() => {
  const state = useStore<{
    board: Cell[];
    currentPlayer: Player;
    gameStatus: GameStatus;
    winner: Player | null;
    winLine: number[] | null;
    scoreboard: { X: number; O: number };
  }>({
    board: Array(9).fill("") as Cell[],
    currentPlayer: "X",
    gameStatus: "playing",
    winner: null,
    winLine: null,
    scoreboard: { X: 0, O: 0 },
  });

  // PUBLIC_INTERFACE
  const handleCellClick = $((i: number) => {
    if (
      state.board[i] !== "" ||
      state.gameStatus !== "playing"
    ) {
      // Cell already filled or game is over
      return;
    }

    state.board[i] = state.currentPlayer;
    const winInfo = detectWinner(state.board);
    if (winInfo) {
      state.gameStatus = "win";
      state.winner = winInfo.player;
      state.winLine = winInfo.line;
      state.scoreboard[winInfo.player]++;
    } else if (isDraw(state.board)) {
      state.gameStatus = "draw";
      state.winner = null;
      state.winLine = null;
    } else {
      state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    }
  });

  // PUBLIC_INTERFACE
  const handleRestart = $(() => {
    state.board = Array(9).fill("") as Cell[];
    state.currentPlayer = state.winner === "O" ? "X" : "O"; // Loser starts or X if draw
    state.gameStatus = "playing";
    state.winner = null;
    state.winLine = null;
  });

  // UI helpers
  const cellClasses = (i: number) => {
    let base =
      "cell" +
      (state.board[i] === "X"
        ? " cell-x"
        : state.board[i] === "O"
        ? " cell-o"
        : "");
    if (state.winLine && state.winLine.includes(i)) {
      base += " win-cell";
    }
    return base;
  };

  const statusText = () => {
    if (state.gameStatus === "win") {
      return (
        <span>
          <span class="winner">{state.winner}</span> wins!
        </span>
      );
    }
    if (state.gameStatus === "draw") {
      return <span>It's a draw!</span>;
    }
    return (
      <>
        Turn:{" "}
        <span
          class={
            state.currentPlayer === "X"
              ? "turn-indicator-x"
              : "turn-indicator-o"
          }
        >
          {state.currentPlayer}
        </span>
      </>
    );
  };

  return (
    <div class="ttt-wrapper">
      <div class="scoreboard">
        <div class="score score-x">
          <span>X</span>
          <span>{state.scoreboard.X}</span>
        </div>
        <div class="score score-o">
          <span>O</span>
          <span>{state.scoreboard.O}</span>
        </div>
      </div>
      <div class="game-panel">
        <div class="status-bar">{statusText()}</div>
        <div class="ttt-board">
          {state.board.map((cell, i) => (
            <button
              key={i}
              class={cellClasses(i)}
              disabled={!!cell || state.gameStatus !== "playing"}
              aria-label={`cell ${i + 1}`}
              type="button"
              onClick$={() => handleCellClick(i)}
            >
              {cell}
            </button>
          ))}
        </div>
        <div class="game-controls">
          <button
            class="restart-btn"
            onClick$={handleRestart}
            type="button"
            aria-label="Restart game"
            data-testid="restart"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
});

