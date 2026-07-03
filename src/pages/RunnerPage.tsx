import "./RunnerPage.css";

import { useState } from "react";

import JSZip from "jszip";

import CurrentWordPanel from "../components/CurrentWordPanel.js";
import ControlPanel from "../components/ControlPanel.js";
import WordInput from "../components/WordInput.js";
import WordList from "../components/WordList.js";

import type {
  CompetitionPackage,
  CompetitionWord,
} from "../types/spellingBee.js";

export default function RunnerPage() {
  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState<CompetitionWord[]>([]);

  const currentWord =
    words.find((word) => word.active) ?? null;

  const canRandomize =
    words.length > 0 && currentWord === null;

  // -----------------------------
  // MANUAL WORD INPUT
  // -----------------------------
  function handleLoadWords() {
    const loadedWords: CompetitionWord[] = wordInput
      .split("\n")
      .map((word) => word.trim())
      .filter(Boolean)
      .map((word) => ({
        word,
        meanings: [],
        alternateSpellings: [],
        used: false,
        active: false,
      }));

    setWords(loadedWords);
  }

  // -----------------------------
  // ZIP PACKAGE
  // -----------------------------
  async function handleUploadPackage(
    file: File,
  ) {
    // Clean up any existing blob URLs.
    words.forEach((word) => {
      if (word.audioUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(word.audioUrl);
      }
    });

    const zip = await JSZip.loadAsync(file);

    const jsonFile = zip.file("words.json");

    if (!jsonFile) {
      alert("No words.json found in package.");
      return;
    }

    const packageData: CompetitionPackage =
      JSON.parse(await jsonFile.async("string"));

    const loadedWords: CompetitionWord[] = [];

    for (const cachedWord of Object.values(
      packageData.words,
    )) {
      let audioUrl = cachedWord.audioUrl;

      if (!audioUrl && cachedWord.audioFile) {
        const audioFile = zip.file(
          `audio/${cachedWord.audioFile}`,
        );

        if (audioFile) {
          const blob = await audioFile.async("blob");
          audioUrl = URL.createObjectURL(blob);
        }
      }

      loadedWords.push({
        ...cachedWord,
        audioUrl,
        used: false,
        active: false,
      });
    }

    setWords(loadedWords);
  }

  // -----------------------------
  // COMPETITION
  // -----------------------------
  function handleRandomWord() {
    const availableWords = words.filter(
      (word) => !word.used,
    );

    if (availableWords.length === 0) {
      alert("All words have been used.");
      return;
    }

    const selected =
      availableWords[
        Math.floor(
          Math.random() * availableWords.length,
        )
      ];

    setWords((previousWords) =>
      previousWords.map((word) => ({
        ...word,
        active: word.word === selected.word,
      })),
    );
  }

  function resolveCurrentWord(markUsed: boolean) {
    setWords((previousWords) =>
      previousWords.map((word) =>
        word.active
          ? {
              ...word,
              active: false,
              used: markUsed ? true : word.used,
            }
          : word,
      ),
    );
  }

  function handleCorrect() {
    resolveCurrentWord(true);
  }

  function handleIncorrect() {
    resolveCurrentWord(false);
  }

  function handleEndRound() {
    resolveCurrentWord(true);
  }

  return (
    <div className="runner-page">
      <CurrentWordPanel currentWord={currentWord} />

      <div className="middle-row">
        <ControlPanel
          canLoadWords={
            wordInput.trim().length > 0
          }
          randomWordEnabled={canRandomize}
          currentWordActive={
            currentWord !== null
          }
          onUploadPackage={
            handleUploadPackage
          }
          onLoadWords={handleLoadWords}
          onRandomWord={
            handleRandomWord
          }
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onEndRound={handleEndRound}
        />

        <WordList words={words} />
      </div>

      <WordInput
        value={wordInput}
        onChange={setWordInput}
      />
    </div>
  );
}