// CSS
import "./App.css";

//React
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from "./data/word.jsx";

//components
import StartScreen from "./components/StartScreen.jsx";
import Game from "./components/Game.jsx";
import GameOver from "./components/GameOver.jsx";

const stages = [
  { id: 0, name: "start" },
  { id: 1, name: "game" },
  { id: 2, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // Start secret word game
  const startGame = useCallback(() => {
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    //cleara ll letters
    clearLetterStates();

    //crate array of latters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the latter input

  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase();

    //check if letter has already utilized

    if (
      guessedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    //push guessed letter or remove a chance

    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter,
      ]);
    } else {
      setWrongLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      //reset all stages
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses, letters, startGame]);

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      // add score
      setScore((actualScore) => actualScore += 100)
      

      // restar game
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage == "start" && <StartScreen startGame={startGame} />}
      {gameStage == "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}

      {gameStage == "end" && <GameOver retry={retry} score={score} />}
    </div>
  );


}

export default App;
