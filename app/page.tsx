"use client";

import { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import dynamic from "next/dynamic";

const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });

interface OnDropProps {
  sourceSquare: string;
  targetSquare: string;
}

export default function Home() {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState("start");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFen(game.fen());
  }, [game]);

  const onDrop = ({ sourceSquare, targetSquare }: OnDropProps) => {
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) return;

    setFen(game.fen());
    checkGameStatus();
  };

  function checkGameStatus() {
    if (game.isCheckmate()) {
      setMessage(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
    } else if (game.isDraw()) {
      setMessage("Draw!");
    } else if (game.isStalemate()) {
      setMessage("Stalemate!");
    } else if (game.isThreefoldRepetition()) {
      setMessage("Threefold repetition!");
    } else if (game.isInsufficientMaterial()) {
      setMessage("Insufficient material!");
    } else if (game.inCheck()) {
      setMessage(`Check! ${game.turn() === "w" ? "White" : "Black"} to move.`);
    } else {
      setMessage(`${game.turn() === "w" ? "White" : "Black"} to move.`);
    }
  }

  function resetGame() {
    game.reset();
    setFen("start");
    setMessage("White to move.");
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#282c34" }}>
      <h1 style={{ color: "white", marginBottom: "2rem" }}>Chess Game</h1>
      <Chessboard
        width={typeof window !== 'undefined' ? Math.min(600, window.innerWidth * 0.8) : 400}
        position={fen}
        onDrop={onDrop}
      />
      <p style={{ color: "white", marginTop: "1rem", fontSize: "1.2rem" }}>{message}</p>
      <button onClick={resetGame} style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer" }}>
        New Game
      </button>
    </main>
  );
}
