"use client";

import { useState } from "react";
import { GameLanding } from "./components/GameLanding";
import { ChatInterface } from "./components/ChatInterface";
import { GameResult } from "./components/GameResult";

type GameState = "landing" | "playing" | "result";

interface Product {
  name: string;
  price: number;
}

interface Customer {
  name: string;
  description: string;
  patience: number;
}

interface ConversationTurn {
  speaker: "player" | "customer";
  message: string;
  timestamp: Date;
}

interface GameSession {
  sessionId: string;
  product: Product;
  customer: Customer;
  conversationHistory: ConversationTurn[];
  turnsRemaining: number;
  playerMoney: number;
  status: "active" | "won" | "lost";
}

interface SalesResult {
  success: boolean;
  moneyEarned: number;
  finalMessage: string;
  reason: string;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [salesResult, setSalesResult] = useState<SalesResult | null>(null);

  const handleStartGame = (session: GameSession) => {
    setGameSession(session);
    setGameState("playing");
  };

  const handleGameEnd = (result: SalesResult) => {
    setSalesResult(result);
    setGameState("result");
  };

  const handlePlayAgain = () => {
    setGameState("landing");
    setGameSession(null);
    setSalesResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {gameState === "landing" && <GameLanding onStartGame={handleStartGame} />}

      {gameState === "playing" && gameSession && (
        <ChatInterface
          gameSession={gameSession}
          onGameEnd={handleGameEnd}
          onUpdateSession={setGameSession}
        />
      )}

      {gameState === "result" && salesResult && (
        <GameResult result={salesResult} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
