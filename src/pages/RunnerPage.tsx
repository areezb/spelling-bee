import "./RunnerPage.css";

import { useState } from "react";

import CurrentWordPanel from "../components/CurrentWordPanel";
import ControlPanel from "../components/ControlPanel";
import WordInput from "../components/WordInput";
import WordList from "../components/WordList";

import type { CachedWord, CompetitionWord } from "../types/spellingBee";

export default function RunnerPage() {
  const [wordInput, setWordInput] = useState("");

  const [loadedWords, setLoadedWords] = useState<CompetitionWord[]>([]);

  const [currentWord, setCurrentWord] = useState<CachedWord | null>(null);

  const [dictionaryCache, setDictionaryCache] = useState<
    Record<string, CachedWord>
  >({});

  const [randomWordEnabled, setRandomWordEnabled] = useState(false);

  function handleUploadPackage() {}

  function handleLoadWords() {
    const words = wordInput
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    const cache: Record<string, CachedWord> = {};

    for (const word of words) {
      cache[word] = {
        word,
        meanings: [],
        alternateSpellings: [],
      };
    }

    setDictionaryCache(cache);

    setLoadedWords(
      words.map((word) => ({
        word,
        used: false,
        active: false,
      })),
    );

    setCurrentWord(null);
    setRandomWordEnabled(true);
  }

  function handleRandomWord() {
    const availableWords = loadedWords.filter((word) => !word.used);

    if (availableWords.length === 0) {
      alert("All words have been used.");
      return;
    }

    const selected =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    setLoadedWords((words) =>
      words.map((word) => ({
        ...word,
        active: word.word === selected.word,
      })),
    );

    setCurrentWord(dictionaryCache[selected.word]);

    setRandomWordEnabled(false);
  }

  function finishCurrentWord(clearWord: boolean) {
    setLoadedWords((words) =>
      words.map((word) =>
        word.active
          ? {
              ...word,
              active: clearWord ? false : word.active,
              used: clearWord ? true : word.used,
            }
          : word,
      ),
    );

    if (clearWord) {
      setCurrentWord(null);
      setRandomWordEnabled(true);
    }
  }

  function handleCorrect() {
    finishCurrentWord(true);
  }

  function handleIncorrect() {
    finishCurrentWord(false);
  }

  function handleEndRound() {
    finishCurrentWord(true);
  }

  return (
    <div className="runner-page">
      <CurrentWordPanel currentWord={currentWord} />

      <div className="middle-row">
        <ControlPanel
          canLoadWords={wordInput.trim().length > 0}
          randomWordEnabled={randomWordEnabled}
          currentWordActive={currentWord !== null}
          onUploadPackage={handleUploadPackage}
          onLoadWords={handleLoadWords}
          onRandomWord={handleRandomWord}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onEndRound={handleEndRound}
        />

        <WordList words={loadedWords} />
      </div>

      <WordInput value={wordInput} onChange={setWordInput} />
    </div>
  );
}
