import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { TURNS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromLocalStorage = window.localStorage.getItem("board");
    console.log(boardFromLocalStorage);
    return boardFromLocalStorage
      ? JSON.parse(boardFromLocalStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = window.localStorage.getItem("turn");

    return turnFromLocalStorage ?? TURNS.x;
  });
  const [winner, setWiner] = useState(null);

  const resetGame = () => {
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
    setBoard(Array(9).fill(null));
    setTurn(TURNS.x);
    setWiner(null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;

    setTurn(newTurn);

    //Guardar Partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWiner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWiner(false);
    }
  };
  return (
    <main className="board">
      <h1>tictactoe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
