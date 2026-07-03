import MeaningEditor from "./MeaningEditor.js";

import type {
  CachedWord,
  Meaning,
} from "../types/spellingBee.js";

interface JsonWordEditorProps {
  word: CachedWord | null;

  onChange(
    originalWord: string,
    updatedWord: CachedWord,
  ): void;
}

export default function JsonWordEditor({
  word,
  onChange,
}: JsonWordEditorProps) {
  if (!word) {
    return (
      <div className="json-word-editor">
        <h2>No word selected</h2>
      </div>
    );
  }

  const currentWord = word;

  function update(
    changes: Partial<CachedWord>,
  ) {
    onChange(currentWord.word, {
      ...currentWord,
      ...changes,
    });
  }

  function updateField<
    K extends keyof CachedWord,
  >(
    key: K,
    value: CachedWord[K],
  ) {
    update({
      [key]: value,
    } as Pick<CachedWord, K>);
  }

  function updateMeaning(
    index: number,
    meaning: Meaning,
  ) {
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
      currentWord.meanings.filter(
        (_, i) => i !== index,
      ),
    );
  }

  return (
    <div className="json-word-editor">
      <h2>Word</h2>

      <label>
        Word
        <input
          value={currentWord.word}
          onChange={(e) =>
            updateField("word", e.target.value)
          }
        />
      </label>

      <label>
        Example
        <textarea
          value={currentWord.example ?? ""}
          onChange={(e) =>
            updateField(
              "example",
              e.target.value,
            )
          }
        />
      </label>

      <label>
        Alternate Spellings
        <input
          value={
            currentWord.alternateSpellings?.join(
              ", ",
            ) ?? ""
          }
          onChange={(e) =>
            updateField(
              "alternateSpellings",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </label>

      <label>
        Audio File
        <input
          value={currentWord.audioFile ?? ""}
          onChange={(e) =>
            updateField(
              "audioFile",
              e.target.value,
            )
          }
        />
      </label>

      <label>
        Audio URL
        <input
          value={currentWord.audioUrl ?? ""}
          onChange={(e) =>
            updateField(
              "audioUrl",
              e.target.value,
            )
          }
        />
      </label>

      <hr />

      <h2>Meanings</h2>

      {currentWord.meanings.map(
        (meaning, index) => (
          <MeaningEditor
            key={index}
            meaning={meaning}
            onChange={(updated) =>
              updateMeaning(index, updated)
            }
            onDelete={() =>
              removeMeaning(index)
            }
          />
        ),
      )}

      <button onClick={addMeaning}>
        Add Meaning
      </button>
    </div>
  );
}