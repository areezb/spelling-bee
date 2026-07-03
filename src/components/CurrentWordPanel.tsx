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

      {/* AUDIO */}
      {currentWord.audioUrl && (
        <div style={{ marginBottom: "1rem" }}>
          <audio controls src={currentWord.audioUrl} />
        </div>
      )}

      {/* DEFINITIONS */}
      {currentWord.meanings.map((meaning) => (
        <div key={meaning.partOfSpeech}>
          <h3>{meaning.partOfSpeech}</h3>

          <ul>
            {meaning.definitions.map((definition, index) => (
              <li key={index}>
                {definition.definition}
                {definition.example && (
                  <>
                    <br />
                    <em>{definition.example}</em>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}