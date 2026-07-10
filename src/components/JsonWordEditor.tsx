import "./JsonWordEditor.css";

import MeaningEditor from "./MeaningEditor.js";

import type { CachedWord, Meaning } from "../types/spellingBee.js";

interface JsonWordEditorProps {
  word: CachedWord | null;

  onChange(originalWord: string, updatedWord: CachedWord): void;

  onDelete(word: string): void;
}

export default function JsonWordEditor({
  word,
  onChange,
  onDelete,
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

  function updateExample(value: string) {
    updateField(
      "example",
      (value.trim() === "" ? undefined : value) as CachedWord["example"],
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
        pronunciations: [],
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
          onChange={(e) => updateExample(e.target.value)}
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

      <hr />

      <button
        onClick={() => {
          if (confirm(`Delete "${currentWord.word}"?`)) {
            onDelete(currentWord.word);
          }
        }}
      >
        Delete Word
      </button>
    </div>
  );
}
