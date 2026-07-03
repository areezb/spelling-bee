import type { CompetitionWord } from "../types/spellingBee.js";

interface CurrentWordPanelProps {
  currentWord: CompetitionWord | null;
}

export default function CurrentWordPanel({
  currentWord,
}: CurrentWordPanelProps) {
  if (!currentWord) {
    return (
      <div className="current-word-panel">
        <h2>No word selected</h2>
      </div>
    );
  }

  return (
    <div className="current-word-panel">
      <h2>
        {currentWord.word}

        {currentWord.alternateSpellings?.length
          ? ` / ${currentWord.alternateSpellings.join(" / ")}`
          : null}
      </h2>

      {currentWord.audioUrl && (
        <div style={{ marginBottom: "1rem" }}>
          <audio controls src={currentWord.audioUrl} />
        </div>
      )}

      {currentWord.meanings.map((meaning) => (
        <div key={meaning.partOfSpeech}>
          <h3>{meaning.partOfSpeech}</h3>

          <ul>
            {meaning.definitions.map((definition, index) => (
              <li key={index}>
                {definition.definition}
              </li>
            ))}
          </ul>
        </div>
      ))}

       {currentWord.example && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Example:</strong>
          <br />
          <em>{currentWord.example}</em>
        </div>
      )}
    </div>
  );
}