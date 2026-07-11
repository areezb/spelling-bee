import "./MeaningEditor.css";

import type { Meaning } from "../types/spellingBee.js";

interface MeaningEditorProps {
  meaning: Meaning;

  onChange(meaning: Meaning): void;

  onDelete(): void;
}

export default function MeaningEditor({
  meaning,
  onChange,
  onDelete,
}: MeaningEditorProps) {
  function updateDefinition(index: number, definition: string) {
    const definitions = [...meaning.definitions];

    definitions[index] = {
      definition,
    };

    onChange({
      ...meaning,
      definitions,
    });
  }

  function addDefinition() {
    onChange({
      ...meaning,
      definitions: [...meaning.definitions, { definition: "" }],
    });
  }

  function removeDefinition(index: number) {
    onChange({
      ...meaning,
      definitions: meaning.definitions.filter((_, i) => i !== index),
    });
  }

  function updatePronunciation(
    index: number,
    changes: Partial<Meaning["pronunciations"][number]>,
  ) {
    const pronunciations = [...meaning.pronunciations];

    pronunciations[index] = {
      ...pronunciations[index],
      ...changes,
    };

    onChange({
      ...meaning,
      pronunciations,
    });
  }

  function addPronunciation() {
    onChange({
      ...meaning,
      pronunciations: [
        ...meaning.pronunciations,
        {
          mwPronunciation: "",
          convertedPronunciation: "",
        },
      ],
    });
  }

  function removePronunciation(index: number) {
    onChange({
      ...meaning,
      pronunciations: meaning.pronunciations.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="meaning-editor">
      <div className="meaning-header">
        <label>
          Part of Speech
          <input
            type="text"
            value={meaning.partOfSpeech}
            onChange={(event) =>
              onChange({
                ...meaning,
                partOfSpeech: event.target.value,
              })
            }
          />
        </label>

        <button onClick={onDelete}>Delete Part of Speech</button>
      </div>

      <h4>Pronunciations</h4>

      {meaning.pronunciations.map((pronunciation, index) => (
        <div key={index} className="pronunciation-row">
          <input
            type="text"
            placeholder="MW Pronunciation"
            value={pronunciation.mwPronunciation}
            readOnly
            className="readonly-input"
          />

          <input
            type="text"
            placeholder="Converted Pronunciation"
            value={pronunciation.convertedPronunciation}
            onChange={(event) =>
              updatePronunciation(index, {
                convertedPronunciation: event.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Audio File"
            value={pronunciation.audioFile ?? ""}
            onChange={(event) =>
              updatePronunciation(index, {
                audioFile:
                  event.target.value.trim() === ""
                    ? undefined
                    : event.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Audio URL"
            value={pronunciation.audioUrl ?? ""}
            onChange={(event) =>
              updatePronunciation(index, {
                audioUrl:
                  event.target.value.trim() === ""
                    ? undefined
                    : event.target.value,
              })
            }
          />

          <button onClick={() => removePronunciation(index)}>×</button>
        </div>
      ))}

      <button onClick={addPronunciation}>Add Pronunciation</button>

      <h4>Definitions</h4>

      {meaning.definitions.map((definition, index) => (
        <div key={index} className="definition-row">
          <textarea
            value={definition.definition}
            onChange={(event) => updateDefinition(index, event.target.value)}
          />

          <button onClick={() => removeDefinition(index)}>×</button>
        </div>
      ))}

      <button onClick={addDefinition}>Add Definition</button>

      <hr />
    </div>
  );
}
