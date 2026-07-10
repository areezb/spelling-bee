import "./JsonWordList.css";

import type { CachedWord } from "../types/spellingBee.js";

interface JsonWordListProps {
  words: Record<string, CachedWord>;
  selectedWord: string | null;
  onSelectWord(word: string): void;
  onAddWord(): void;
}

function isIncomplete(word: CachedWord) {
  const hasDefinitions = word.meanings.some(
    (meaning) => meaning.definitions.length > 0,
  );

  const hasAudio = word.meanings.some((meaning) =>
    meaning.pronunciations.some(
      (pronunciation) => pronunciation.audioFile || pronunciation.audioUrl,
    ),
  );

  return (
    !word.example || (!hasAudio) || !hasDefinitions
  );
}

export default function JsonWordList({
  words,
  selectedWord,
  onSelectWord,
  onAddWord,
}: JsonWordListProps) {
  const wordNames = Object.keys(words).sort();

  const incompleteCount = wordNames.filter((word) =>
    isIncomplete(words[word]),
  ).length;

  const completeCount = wordNames.length - incompleteCount;

  return (
    <div className="editor-word-list">
      <h2>Words</h2>
      <p className="editor-word-list-summary">
        {completeCount} / {wordNames.length} complete
        {incompleteCount > 0 && (
          <>
            <br />
            {incompleteCount}{" "}
            {incompleteCount === 1
              ? "word needs attention"
              : "words need attention"}
          </>
        )}
      </p>

      <ul>
        {wordNames.map((word) => (
          <li
            key={word}
            onClick={() => onSelectWord(word)}
            className={word === selectedWord ? "selected" : ""}
          >
            {isIncomplete(words[word]) && "⚠ "}
            {word}
          </li>
        ))}
      </ul>
      <button onClick={onAddWord}>Add Word</button>
    </div>
  );
}
