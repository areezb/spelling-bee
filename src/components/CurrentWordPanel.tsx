import "./CurrentWordPanel.css";

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
  const pronunciations = Array.from(
    new Map(
      currentWord.meanings
        .flatMap((m) => m.pronunciations)
        .map((p) => [p.pronunciation, p]),
    ).values(),
  );
  return (
    <div className="current-word-panel">
      {currentWord ? (
        <>
          <h2>
            {currentWord.word}

            {currentWord.alternateSpellings?.length
              ? ` / ${currentWord.alternateSpellings.join(" / ")}`
              : null}
          </h2>

          {pronunciations.length > 0 && (
            <div className="pronunciation-section">
              <h3>Pronunciations</h3>

              {pronunciations.map((pronunciation, index) => (
                <div key={index} className="pronunciation-row">
                  <span className="pronunciation-text">
                    {pronunciation.pronunciation}
                  </span>

                  {pronunciation.playbackAudio && (
                    <audio controls src={pronunciation.playbackAudio} />
                  )}
                </div>
              ))}
            </div>
          )}

          {currentWord.meanings.map((meaning) => (
            <div key={meaning.partOfSpeech}>
              <h3>{meaning.partOfSpeech}</h3>

              <ul>
                {meaning.definitions.map((definition, index) => (
                  <li key={index}>{definition.definition}</li>
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
        </>
      ) : (
        <h2>No word selected</h2>
      )}
    </div>
  );
}
