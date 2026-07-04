import "./JsonWordEditor.css";

import MeaningEditor from "./MeaningEditor.js";

import type { CachedWord, Meaning } from "../types/spellingBee.js";

interface JsonWordEditorProps {
  word: CachedWord | null;

  onChange(originalWord: string, updatedWord: CachedWord): void;
}

export default function JsonWordEditor({
  word,
  onChange,
}: JsonWordEditorProps) {
  if (!word) {
    return (
      <div className="word-editor">
        <h2>No word selected</h2>
      </div>
    );
  }

  const currentWord = word;

  function update(changes: Partial<CachedWord>) {
    onChange(currentWord.word, {
      ...currentWord,
      ...changes,
    });
  }

  function updateField<K extends keyof CachedWord>(
    key: K,
    value: CachedWord[K],
  ) {
    update({
      [key]: value,
    } as Pick<CachedWord, K>);
  }

  function updateOptionalField<K extends "example" | "audioFile" | "audioUrl">(
    key: K,
    value: string,
  ) {
    updateField(
      key,
      (value.trim() === "" ? undefined : value) as CachedWord[K],
    );
  }

  function updateMeaning(index: number, meaning: Meaning) {
    const meanings = [...currentWord.meanings];
    meanings[index] = meaning;

    updateField("meanings", meanings);
  }

  function addMeaning() {
    updateField("meanings", [
      ...currentWord.meanings,
      {
        partOfSpeech: "",
        definitions: [],
      },
    ]);
  }

  function removeMeaning(index: number) {
    updateField(
      "meanings",
      currentWord.meanings.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="word-editor">
      <h2>Word</h2>

      <label>
        Word
        <input
          value={currentWord.word}
          onChange={(e) => updateField("word", e.target.value)}
        />
      </label>

      <label>
        Example
        <textarea
          value={currentWord.example ?? ""}
          onChange={(e) => updateOptionalField("example", e.target.value)}
        />
      </label>

      <label>Alternate Spellings</label>

      {(currentWord.alternateSpellings ?? []).map((spelling, index) => (
        <div key={index} className="alternate-spelling-row">
          <input
            value={spelling}
            onChange={(e) => {
              const spellings = [...(currentWord.alternateSpellings ?? [])];

              spellings[index] = e.target.value;

              updateField("alternateSpellings", spellings);
            }}
          />

          <button
            onClick={() => {
              updateField(
                "alternateSpellings",
                (currentWord.alternateSpellings ?? []).filter(
                  (_, i) => i !== index,
                ),
              );
            }}
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          updateField("alternateSpellings", [
            ...(currentWord.alternateSpellings ?? []),
            "",
          ])
        }
      >
        Add Alternate Spelling
      </button>

      <label>
        Audio File
        <input
          value={currentWord.audioFile ?? ""}
          onChange={(e) => updateOptionalField("audioFile", e.target.value)}
        />
      </label>

      <label>
        Audio URL
        <input
          value={currentWord.audioUrl ?? ""}
          onChange={(e) => updateOptionalField("audioUrl", e.target.value)}
        />
      </label>

      <hr />

      <h2>Meanings</h2>

      {currentWord.meanings.map((meaning, index) => (
        <MeaningEditor
          key={index}
          meaning={meaning}
          onChange={(updated) => updateMeaning(index, updated)}
          onDelete={() => removeMeaning(index)}
        />
      ))}

      <button onClick={addMeaning}>Add Meaning</button>
    </div>
  );
}
