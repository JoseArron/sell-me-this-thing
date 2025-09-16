"use client";

import { useEffect, useState } from "react";

interface SalesResult {
  success: boolean;
  moneyEarned: number;
  finalMessage: string;
  reason: string;
}

interface GameResultProps {
  result: SalesResult;
  onPlayAgain: () => void;
}

export function GameResult({ result, onPlayAgain }: GameResultProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [winLine, setWinLine] = useState<string>("");

  useEffect(() => {
    if (result.success) {
      setShowConfetti(true);

      const lines = [
        "I'm in for 50% equity and naming rights. Let's call it 'MegaThing™'.",
        `I'll give you $${result.moneyEarned}... but I want 51% and the company mascot.`,
        "I want 50% equity and lifetime supply for my pets, my cousins, and my barber.",
      ];
      setWinLine(lines[Math.floor(Math.random() * lines.length)]);

      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result.success, result.moneyEarned]);

  useEffect(() => {
    if (result.success) {
      setShowConfetti(true);

      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result.success]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Confetti animation */}
      {showConfetti && result.success && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              {
                ["🎉", "💰", "✨", "🎊", "💎", "🏆"][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none opacity-10">
        {result.success ? (
          <>
            <div className="absolute top-20 left-10 text-8xl rotate-12 animate-bounce">
              🎉
            </div>
            <div className="absolute top-32 right-16 text-6xl -rotate-12 float-animation">
              💰
            </div>
            <div className="absolute bottom-40 left-20 text-7xl rotate-45 animate-pulse">
              🏆
            </div>
            <div className="absolute bottom-20 right-32 text-5xl -rotate-45 float-animation">
              ✨
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-10 text-6xl rotate-12 animate-bounce">
              😔
            </div>
            <div className="absolute top-32 right-16 text-4xl -rotate-12 float-animation">
              💔
            </div>
            <div className="absolute bottom-40 left-20 text-5xl rotate-45 animate-pulse">
              😞
            </div>
            <div className="absolute bottom-20 right-32 text-3xl -rotate-45 float-animation">
              ⚡
            </div>
          </>
        )}
      </div>

      <div className="text-center space-y-8 z-10 max-w-2xl bounce-in">
        {result.success ? (
          /* Win Screen */
          <div className="space-y-6">
            <div className="doodle-card p-8 bg-green-100 border-green-300 transform -rotate-1">
              <h1 className="text-5xl md:text-7xl handwritten font-bold mb-4 text-green-800">
                🎉 SOLD! 🎉
              </h1>
              <div className="w-40 h-2 bg-green-500 mx-auto transform rotate-1 rounded-full mb-4"></div>
            </div>

            <div className="doodle-card p-6 bg-yellow-100 transform rotate-1">
              <h2 className="text-3xl font-bold mb-4 text-yellow-800">
                💰 You Earned: ${result.moneyEarned}
              </h2>
              <p className="text-lg text-gray-700">{result.finalMessage}</p>
            </div>

            <div className="doodle-card p-4 bg-blue-100 transform -rotate-1">
              <p className=" text-base text-gray-600">🎯 {result.reason}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xl  text-green-700 transform rotate-1">
                🦈 {winLine}
              </p>
              <p className="text-lg  text-purple-700 transform -rotate-1">
                💼 “For that reason… I’m in.”
              </p>
            </div>
          </div>
        ) : (
          /* Lose Screen */
          <div className="space-y-6">
            <div className="doodle-card p-8 bg-red-100 border-red-300 transform rotate-1">
              <h1 className="text-5xl md:text-7xl handwritten font-bold mb-4 text-red-800">
                😔 No Sale
              </h1>
              <div className="w-40 h-2 bg-red-500 mx-auto transform -rotate-1 rounded-full mb-4"></div>
            </div>

            <div className="doodle-card p-6 bg-orange-100 transform -rotate-1">
              <h2 className="text-2xl font-bold mb-4 text-orange-800">
                💔 The customer walked away...
              </h2>
              <p className="text-lg text-gray-700">{result.finalMessage}</p>
            </div>

            <div className="doodle-card p-4 bg-blue-100 transform rotate-1">
              <p className="text-base text-gray-600">🤔 {result.reason}</p>
            </div>

            {/* Encouragement messages */}
            <div className="space-y-3">
              <p className="text-xl  text-blue-700 transform -rotate-1">
                💪 Don&apos;t give up!
              </p>
              <p className="text-lg  text-purple-700 transform rotate-1">
                🎯 Try something new next time!
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-12">
          <button
            onClick={onPlayAgain}
            className="doodle-button px-8 py-4 text-xl font-bold bg-green-100 transform -rotate-1 hover:rotate-0 transition-transform"
          >
            🔄 Play Again
          </button>
        </div>

        <div className="doodle-card p-6 bg-gray-100 max-w-md mx-auto transform rotate-1 mt-8">
          <h3 className="handwritten text-lg font-bold mb-3">💡 Sales Tips:</h3>
          <ul className="text-sm space-y-2 text-left">
            <li>• Listen to customer interests</li>
            <li>• Match your product to their needs</li>
            <li>• Be persuasive but not pushy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
