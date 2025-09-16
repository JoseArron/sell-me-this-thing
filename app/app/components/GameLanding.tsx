"use client";

import { useState } from "react";
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

interface GameLandingProps {
  onStartGame: (session: GameSession) => void;
}

export function GameLanding({ onStartGame }: GameLandingProps) {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

  const handleGenerateRandom = async () => {
    setIsGeneratingRandom(true);
    try {
      const response = await fetch(api("/game/random-product"));
      if (response.ok) {
        const product = await response.json();
        setProductName(product.name);
        setProductPrice(product.price.toString());
      } else {
        console.error("Failed to generate random product");
      }
    } catch (error) {
      console.error("Error generating random product:", error);
    }
    setIsGeneratingRandom(false);
  };

  const handleStartGame = async () => {
    if (!productName.trim() || !productPrice.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(api("/game/start"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName.trim(),
          price: parseFloat(productPrice),
        }),
      });
      if (response.ok) {
        const gameSession = await response.json();
        onStartGame(gameSession);
      } else {
        console.error("Failed to start game");
      }
    } catch (error) {
      console.error("Error starting game:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="absolute top-20 left-10 text-6xl"
          style={{ transform: "rotate(12deg)" }}
        >
          💰
        </div>
        <div
          className="absolute top-32 right-16 text-4xl"
          style={{ transform: "rotate(-12deg)" }}
        >
          🛍️
        </div>
        <div
          className="absolute bottom-40 left-20 text-5xl"
          style={{ transform: "rotate(45deg)" }}
        >
          💡
        </div>
        <div
          className="absolute bottom-20 right-32 text-3xl"
          style={{ transform: "rotate(-45deg)" }}
        >
          ✨
        </div>
        <div
          className="absolute top-1/2 left-4 text-4xl"
          style={{ transform: "rotate(90deg)" }}
        >
          🎯
        </div>
        <div
          className="absolute top-1/4 right-4 text-5xl"
          style={{ transform: "rotate(-12deg)" }}
        >
          🎪
        </div>
      </div>

      {/* Main content */}
      <div className="text-center space-y-8 z-10 max-w-2xl">
        {/* Hero Title */}
        <div>
          <h1
            className="handwritten text-6xl md:text-8xl font-bold mb-4 scale-200"
            style={{ transform: "rotate(1deg)" }}
          >
            Sell Me This Thing!
          </h1>
          <div
            className="w-32 h-1 bg-black mx-auto rounded-full"
            style={{ transform: "rotate(-1deg)" }}
          ></div>
        </div>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-gray-700 max-w-md mx-auto"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          You think you can sell anything to anyone? Prove it ( ͡° ͜ʖ ͡°)
        </p>

        {/* Product input */}
        <div className="space-y-6 mt-12">
          <div
            className="max-w-md mx-auto space-y-4 p-6 border-[4px] border-black rounded-3xl bg-white shadow-lg"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            <label
              htmlFor="product-name"
              className="block text-lg font-semibold"
            >
              What do you want to sell?
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Sparkling Water, Longganisa, etc."
              className="w-full text-lg p-3 border-[3px] border-black rounded-2xl shadow-md"
              disabled={isLoading || isGeneratingRandom}
            />

            <label
              htmlFor="product-price"
              className="block text-lg font-semibold"
            >
              Price (₱)
            </label>
            <input
              id="product-price"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full text-lg p-3 border-[3px] border-black rounded-2xl shadow-md"
              disabled={isLoading || isGeneratingRandom}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              onClick={handleGenerateRandom}
              disabled={isGeneratingRandom || isLoading}
              variant="secondary"
              className="px-6 py-3 text-lg font-semibold shadow-lg transition-colors"
              style={{ transform: "rotate(-1deg)" }}
            >
              {isGeneratingRandom
                ? "✨ Generating..."
                : "🎲 I'm feeling lucky today!"}
            </Button>

            <Button
              onClick={handleStartGame}
              disabled={
                !productName.trim() ||
                !productPrice.trim() ||
                isLoading ||
                isGeneratingRandom
              }
              className="px-8 py-4 text-xl font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: "rotate(1deg)" }}
            >
              {isLoading ? "Starting..." : "🚀 SELL!"}
            </Button>
          </div>

          {/* Instructions */}
          <div
            className="max-w-lg mx-auto mt-8 p-6 bg-blue-50 border-[3px] border-black rounded-3xl shadow-lg"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
            <ol className="text-left space-y-2 list-decimal list-inside">
              <li>Enter the product you want to sell</li>
              <li>Set your price</li>
              <li>Convince the customer to buy it!</li>
              <li>Win money!! 💰💰💰</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
