import React, { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import "./App.css";

import HangmanWord from "./HangmanWord";

import { HangmanDrawing } from "./HangmanDrawing";
import over from "../src/assets/over.gif";
import winner from "../src/assets/winner.gif";
import Keyboard from "./Keyboard";

const getWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

type leaderboard = {
  rank?: number;
  name: string;
  attempts: number;
  points: number;
};
function App() {
  const isMobile = window.innerWidth <= 768;
  const [wordToGuess, setWordToGuess] = useState(getWord());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  // User related states
  const [user, setUser] = useState<string>(""); // To store username
  const [leaderboard, setLeaderboard] = useState<leaderboard[]>([]);

  // Modal form state
  const [showForm, setShowForm] = useState<boolean>(true);
  const [usernameInput, setUsernameInput] = useState<string>("");

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isLoser = incorrectLetters.length >= 6;

  useEffect(() => {
    if (isWinner) {
      updateLeaderboard(user, true);
    }

    if (isLoser) {
      updateLeaderboard(user, false);
    }
  }, [isWinner, isLoser]);

  // Retrieve leaderboard from localStorage when the component mounts
  useEffect(() => {
    const storedLeaderboard = localStorage.getItem("hangman-leaderboard");
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  // Function to update the leaderboard
  const updateLeaderboard = (name: string, won: boolean) => {
    setLeaderboard((prevLeaderboard) => {
      const existingUser = prevLeaderboard.find((entry) => entry.name === name);

      let updatedLeaderboard;
      if (existingUser) {
        updatedLeaderboard = prevLeaderboard.map((entry) =>
          entry.name === name
            ? {
                ...entry,
                points: won ? entry.points + 1 : entry.points,
                attempts: entry.attempts + 1,
              }
            : entry
        );
      } else {
        updatedLeaderboard = [
          ...prevLeaderboard,
          { name, points: won ? 1 : 0, attempts: 1 },
        ];
      }

      // Save the updated leaderboard to localStorage
      localStorage.setItem(
        "hangman-leaderboard",
        JSON.stringify(updatedLeaderboard)
      );

      return updatedLeaderboard;
    });
  };

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters((prev) => [...prev, letter]);
    },
    [guessedLetters, isLoser, isWinner]
  );

  useEffect(() => {
    const handler = (e: WindowEventMap["keydown"]): void => {
      if (!showForm) {
        const key = e.key.toLowerCase();
        if (!key.match(/^[a-z]$/)) return;

        e.preventDefault();
        addGuessedLetter(key);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [guessedLetters, showForm]);

  const handleNewGame = () => {
    setGuessedLetters([]);
    setWordToGuess(getWord());
  };

  // Form submission to set username
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUser(usernameInput.trim());
      setShowForm(false);
      handleNewGame();
    }
  };

  const handleLogout = () => {
    setUser("");
    setShowForm(true);
    setUsernameInput("");
  };
  return (
    <div>
      {/* Username Form Popup */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Enter Your Name to Start
            </h2>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              style={{
                border: "2px solid #D1D5DB", // gray-300
                borderRadius: "4px",
                padding: "8px",
                marginBottom: "16px",
                width: "100%",
                boxSizing: "border-box",
              }}
              placeholder="Username"
              required
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff", // green-500
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                border: "none",
                transition: "background-color 0.3s",
              }}
            >
              Start Game
            </button>
          </form>
        </div>
      )}

      {!showForm && (
        <div
          style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            margin: "0 auto",
            alignItems: "center",
            position: "relative",
          }}
        >
          <HangmanDrawing
            swing={isLoser}
            winner={isWinner}
            numberOfGuesses={incorrectLetters.length}
          />
          <div
            style={{
              fontSize: "2rem",
              textAlign: "center",
              display: isMobile ? "none" : "block",
            }}
          >
            {" "}
            {isWinner && (
              <div style={{ position: "absolute", right: "-25%", top: "10%" }}>
                <img
                  src={winner}
                  alt=""
                  style={{ width: "250px", height: "250px" }}
                />
              </div>
            )}
            {isLoser && (
              <div style={{ position: "absolute", right: "-45%", top: "7%" }}>
                <img src={over} alt="" />
              </div>
            )}
          </div>

          <div style={{ display: isMobile ? "block" : "none" }}>
            {isWinner && (
              <div style={{ fontSize: "30px", color: "green" }}>You Won!</div>
            )}
            {isLoser && (
              <div style={{ fontSize: "30px", color: "red" }}>
                You Lose! Try Again
              </div>
            )}
          </div>

          <HangmanWord
            reveal={isLoser}
            winner={isWinner}
            guessedLetters={guessedLetters}
            wordToGuess={wordToGuess}
          />
          <div
            style={{ alignSelf: "stretch", width: "90%", marginInline: "auto" }}
          >
            <Keyboard
              disabled={isLoser || isWinner}
              activeLetters={guessedLetters.filter((letter) =>
                wordToGuess.includes(letter)
              )}
              inactiveLetters={incorrectLetters}
              addGuessedLetter={addGuessedLetter}
            />
          </div>

          {/* Logout Btn */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "#EF4444", // red-500
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s",
            }}
          >
            Log Out
          </button>

          {(isLoser || isWinner) && (
            <button
              onClick={handleNewGame}
              style={{
                background: "gray",
                color: "black",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "5px",
              }}
            >
              RESTART
            </button>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div style={{ marginTop: "24px", width: "90%", maxWidth: "32rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                Leaderboard
              </h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #9CA3AF", // gray-400
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #9CA3AF",
                        padding: "8px",
                      }}
                    >
                      Rank
                    </th>
                    <th
                      style={{
                        border: "1px solid #9CA3AF",
                        padding: "8px",
                      }}
                    >
                      Username
                    </th>
                    <th
                      style={{
                        border: "1px solid #9CA3AF",
                        padding: "8px",
                      }}
                    >
                      No of try
                    </th>
                    <th
                      style={{
                        border: "1px solid #9CA3AF",
                        padding: "8px",
                      }}
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard
                    .sort((a, b) => b.points - a.points) // Sort leaderboard by points (descending)
                    .map((entry, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid #9CA3AF",
                            padding: "8px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid #9CA3AF",
                            padding: "8px",
                          }}
                        >
                          {entry.name}
                        </td>
                        <td
                          style={{
                            border: "1px solid #9CA3AF",
                            padding: "8px",
                          }}
                        >
                          {entry.attempts}
                        </td>
                        <td
                          style={{
                            border: "1px solid #9CA3AF",
                            padding: "8px",
                          }}
                        >
                          {entry.points}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
