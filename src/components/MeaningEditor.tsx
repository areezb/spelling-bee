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
  function updateDefinition(
    index: number,
    definition: string,
  ) {
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
      definitions: [
        ...meaning.definitions,
        { definition: "" },
      ],
    });
  }

  function removeDefinition(index: number) {
    onChange({
      ...meaning,
      definitions: meaning.definitions.filter(
        (_, i) => i !== index,
      ),
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

        <button onClick={onDelete}>
          Delete Part of Speech
        </button>
      </div>

      <h4>Definitions</h4>

      {meaning.definitions.map(
        (definition, index) => (
          <div
            key={index}
            className="definition-row"
          >
            <input
              type="text"
              value={definition.definition}
              onChange={(event) =>
                updateDefinition(
                  index,
                  event.target.value,
                )
              }
            />

            <button
              onClick={() =>
                removeDefinition(index)
              }
            >
              ×
            </button>
          </div>
        ),
      )}

      <button onClick={addDefinition}>
        Add Definition
      </button>

      <hr />
    </div>
  );
}