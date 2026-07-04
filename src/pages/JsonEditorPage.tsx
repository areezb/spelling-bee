import "./JsonEditorPage.css";

import { useState } from "react";

import EditorControlPanel from "../components/JsonEditorControls.js";
import JsonWordEditor from "../components/JsonWordEditor.js";
import JsonWordList from "../components/JsonWordList.js";

import type { CachedWord, CompetitionPackage } from "../types/spellingBee.js";

export default function JsonEditorPage() {
  const [words, setWords] = useState<Record<string, CachedWord>>({});

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const currentWord =
    selectedWord == null ? null : (words[selectedWord] ?? null);

  function handleLoadWords(loadedWords: CompetitionPackage) {
    setWords(loadedWords.words);

    const firstWord = Object.keys(loadedWords.words)[0];

    setSelectedWord(firstWord ?? null);
  }

  function handleWordChange(originalWord: string, updatedWord: CachedWord) {
    setWords((previous) => {
      if (originalWord !== updatedWord.word && previous[updatedWord.word]) {
        alert("A word with that name already exists.");
        return previous;
      }

      const next = { ...previous };

      delete next[originalWord];

      next[updatedWord.word] = updatedWord;

      return next;
    });

    setSelectedWord(updatedWord.word);
  }

  return (
    <div className="editor-page">
      <EditorControlPanel words={words} onLoadWords={handleLoadWords} />

      <JsonWordEditor word={currentWord} onChange={handleWordChange} />

      <JsonWordList
        words={words}
        selectedWord={selectedWord}
        onSelectWord={setSelectedWord}
      />
    </div>
  );
}
