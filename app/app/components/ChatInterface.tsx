"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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

interface CustomerResponse {
  message: string;
  willBuy: boolean;
}

interface SalesResult {
  success: boolean;
  moneyEarned: number;
  finalMessage: string;
  reason: string;
}

interface ChatInterfaceProps {
  gameSession: GameSession;
  onGameEnd: (result: SalesResult) => void;
  onUpdateSession: (session: GameSession) => void;
}

export function ChatInterface({
  gameSession,
  onGameEnd,
  onUpdateSession,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [gameSession.conversationHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const playerMessage = message.trim();

    const updatedSession: GameSession = {
      ...gameSession,
      conversationHistory: [
        ...gameSession.conversationHistory,
        {
          speaker: "player" as const,
          message: playerMessage,
          timestamp: new Date(),
        },
      ],
    };

    onUpdateSession(updatedSession);

    setIsLoading(true);

    setMessage("");

    try {
      const response = await fetch(api("/game/message"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: gameSession.sessionId,
          message: playerMessage,
        }),
      });

      if (response.ok) {
        const customerResponse: CustomerResponse = await response.json();

        const turnsLeft = Math.max(0, gameSession.turnsRemaining - 1);
        const newStatus: "active" | "won" | "lost" = customerResponse.willBuy
          ? "won"
          : turnsLeft <= 0
          ? "lost"
          : "active";

        const updatedSession: GameSession = {
          ...gameSession,
          conversationHistory: [
            ...gameSession.conversationHistory,
            {
              speaker: "player" as const,
              message: playerMessage,
              timestamp: new Date(),
            },
            {
              speaker: "customer" as const,
              message: customerResponse.message,
              timestamp: new Date(),
            },
          ],
          turnsRemaining: turnsLeft,
          status: newStatus,
        };

        onUpdateSession(updatedSession);

        if (customerResponse.willBuy || turnsLeft <= 0) {
          try {
            const endResp = await fetch(
              api(`/game/end/${gameSession.sessionId}`),
              { method: "POST" }
            );
            if (endResp.ok) {
              const result: SalesResult = await endResp.json();
              setTimeout(() => onGameEnd(result), 800);
            } else {
              console.error("Failed to end game");
            }
          } catch (e) {
            console.error("Error ending game:", e);
          }
        }
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="m-4 p-6 border-[4px] border-black rounded-3xl bg-blue-50 shadow-lg"
        style={{ transform: "rotate(-0.5deg)" }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              🏷️ Selling: {gameSession.product.name}
            </h2>
            <p className="text-lg">💰 Price: ${gameSession.product.price}</p>
          </div>

          {/* Customer Info */}
          <div
            className="flex-1 p-4 border-[3px] border-black rounded-2xl bg-yellow-100 shadow-md"
            style={{ transform: "rotate(0.5deg)" }}
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              🧑‍💼 {gameSession.customer.name}
            </h3>
            <p className="text-sm mb-2">{gameSession.customer.description}</p>
            <div className="mt-2">
              <span className="text-sm">
                ⏰ Turns left: {gameSession.turnsRemaining}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {gameSession.conversationHistory.length === 0 && (
          <div className="text-center">
            <div className="doodle-card max-w-md mx-auto p-6 bg-yellow-100 bounce-in">
              <h3 className="handwritten text-xl font-bold mb-2 scale-150">
                👋 Start the conversation!
              </h3>
              <p>
                This is {gameSession.customer.name}. Try to convince them to buy
                your {gameSession.product.name}!
              </p>
            </div>
          </div>
        )}

        {gameSession.conversationHistory.map((turn, index) => (
          <div
            key={index}
            className={`flex ${
              turn.speaker === "player" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-4 border-[3px] border-black rounded-2xl shadow-md ${
                turn.speaker === "player" ? "bg-blue-100" : "bg-green-100"
              }`}
              style={{
                transform:
                  turn.speaker === "player" ? "rotate(1deg)" : "rotate(-1deg)",
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">
                  {turn.speaker === "player" ? "🧑" : "🧑‍💼"}
                </span>
                <div>
                  <p className="font-semibold text-sm">
                    {turn.speaker === "player"
                      ? "You"
                      : gameSession.customer.name}
                  </p>
                  <p className="text-sm mt-1">{turn.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="max-w-xs p-4 border-[3px] border-black rounded-2xl bg-gray-100 shadow-md"
              style={{ transform: "rotate(-1deg)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🧑‍💼</span>
                <div>
                  <p className="font-semibold text-sm">
                    {gameSession.customer.name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="animate-pulse">thinking...</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-4 border-black bg-white">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your best pitch here..."
            className="flex-1 p-3 border-[3px] border-black rounded-2xl resize-none text-base shadow-md"
            rows={2}
            disabled={isLoading || gameSession.status !== "active"}
          />
          <Button
            onClick={handleSendMessage}
            disabled={
              !message.trim() || isLoading || gameSession.status !== "active"
            }
            className="px-6 py-2 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "..." : "📤 Send"}
          </Button>
        </div>

        {gameSession.status !== "active" && (
          <p className="text-center text-lg mt-2 text-gray-600">
            Game ended -{" "}
            {gameSession.status === "won" ? "You won! 🎉" : "Customer left 😔"}
          </p>
        )}
      </div>
    </div>
  );
}
