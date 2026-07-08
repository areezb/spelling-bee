import "./RunnerPage.css";

import { useState } from "react";

import JSZip from "jszip";

import CurrentWordPanel from "../components/CurrentWordPanel.js";
import ControlPanel from "../components/RunnerControlPanel.tsx";
import WordList from "../components/RunnerWordList.tsx";

import type {
  CompetitionPackage,
  CompetitionWord,
} from "../types/spellingBee.js";
import Navbar from "../components/Navbar.tsx";

export default function RunnerPage() {
  const [words, setWords] = useState<CompetitionWord[]>([]);

  const currentWord = words.find((word) => word.active) ?? null;

  const canRandomize = words.length > 0 && currentWord === null;

  // -----------------------------
  // COMPETITION PACKAGE
  // -----------------------------
  async function handleUploadPackage(file: File) {
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

    const packageData: CompetitionPackage = JSON.parse(
      await jsonFile.async("string"),
    );

    const loadedWords: CompetitionWord[] = [];

    for (const cachedWord of Object.values(packageData.words)) {
      let playbackAudio: string | undefined;
      
      if (cachedWord.audioFile) {
        const audioFile = zip.file(`audio/${cachedWord.audioFile}`);
      
        if (audioFile) {
            const blob = await audioFile.async("blob");
            playbackAudio = URL.createObjectURL(blob);
          }
      }
      if (!cachedWord.audioFile) {
        playbackAudio = cachedWord.audioUrl;
      }

      loadedWords.push({
        ...cachedWord,
        playbackAudio,
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
    const availableWords = words.filter((word) => !word.used);

    if (availableWords.length === 0) {
      alert("All words have been used.");
      return;
    }

    const selected =
      availableWords[Math.floor(Math.random() * availableWords.length)];

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

  function handleEndRound() {
    resolveCurrentWord(true);
  }

  return (
    <>
      <Navbar />
      <div className="runner-page">
        <ControlPanel
          randomWordEnabled={canRandomize}
          currentWordActive={currentWord !== null}
          onUploadPackage={handleUploadPackage}
          onRandomWord={handleRandomWord}
          onCorrect={handleCorrect}
          onEndRound={handleEndRound}
        />

        <CurrentWordPanel currentWord={currentWord} />

        <WordList words={words} />
      </div>
    </>
  );
}
