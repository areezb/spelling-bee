import type { CachedWord } from "../../shared/spellingBee";

interface CurrentWordPanelProps {
  currentWord: CachedWord | null;
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

        {currentWord.alternateSpellings &&
          currentWord.alternateSpellings.length > 0 &&
          ` / ${currentWord.alternateSpellings.join(" / ")}`}
      </h2>

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