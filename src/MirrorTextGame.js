import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MirrorTextGame.css";
import apiService from './apiService';

const MirrorTextGame = () => {
  const [difficulty, setDifficulty] = useState(""); 
  const [words, setWords] = useState([]); 
  const [selectedWord, setSelectedWord] = useState(null); 
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0); // 🆕 Score state
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch words from API Service
  const fetchWords = useCallback(async () => {
    if (!difficulty) return;
    const wordList = await apiService.getWords(difficulty);
    setWords(wordList);
  }, [difficulty]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    if (selectedWord && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && selectedWord) {
      showNotification("⏳ Time Up! Try Again.", "error");
      setSelectedWord(null); // Reset selection
    }
  }, [timeLeft, selectedWord]);

  // Handle word selection
  const handleWordSelection = (word) => {
    setSelectedWord(word);
    setTimeLeft(30);
  };

  // Handle user input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Validate user input
  const validateInput = useCallback(async () => {
    if (!selectedWord) return;

    const isCorrect = await apiService.validateAttempt(selectedWord.original, userInput);
    if (isCorrect) {
      showNotification("✅ Correct! Well done!", "success");
      setScore((prevScore) => prevScore + 10); // 🆕 Increase score
      setSelectedWord(null); // 🆕 Reset to word selection
    } else {
      showNotification("❌ Incorrect! Try Again.", "error");
      setScore((prevScore) => (prevScore > 0 ? prevScore - 5 : 0)); // 🆕 Deduct points if wrong
    }
    setUserInput("");
  }, [selectedWord, userInput]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 2000);
  };

  return (
    <div className="game-container">
      {notification.message && (
        <div className={`popup-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h2>Mirror-Image Text Challenge</h2>
      <p className="score">🏆 Score: {score}</p> {/* 🆕 Display Score */}

      {!difficulty ? (
        <div className="difficulty-selection">
          <h3>Select Difficulty:</h3>
          <button className="btn btn-success mx-2" onClick={() => setDifficulty("easy")}>Easy</button>
          <button className="btn btn-warning mx-2" onClick={() => setDifficulty("medium")}>Medium</button>
          <button className="btn btn-danger mx-2" onClick={() => setDifficulty("hard")}>Hard</button>
        </div>
      ) : !selectedWord ? (
        <div className="word-selection">
          <h3>Select a Word:</h3>
          <div className="word-list">
            {words.map((word, index) => (
              <button key={index} className="btn btn-primary m-2" onClick={() => handleWordSelection(word)}>
                {word.mirror}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="level">Level: {difficulty.toUpperCase()}</p>
          <p className="timer">⏳ Time Left: {timeLeft}s</p>
          <div className="mirror-text">{selectedWord.mirror}</div>
          <input
            type="text"
            className="form-control mt-2"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the correct word"
          />
          <button className="btn btn-success mt-2" onClick={validateInput}>Submit</button>
        </>
      )}
    </div>
  );
};

export default MirrorTextGame;
