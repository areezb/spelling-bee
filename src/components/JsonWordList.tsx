import "./JsonWordList.css";

import type { CachedWord } from "../types/spellingBee.js";

interface JsonWordListProps {
  words: Record<string, CachedWord>;
  selectedWord: string | null;
  onSelectWord(word: string): void;
}

export default function JsonWordList({
  words,
  selectedWord,
  onSelectWord,
}: JsonWordListProps) {
  const wordNames = Object.keys(words).sort();

  return (
    <div className="word-list">
      <h2>Words</h2>

      <ul>
        {wordNames.map((word) => (
          <li
            key={word}
            onClick={() => onSelectWord(word)}
            className={word === selectedWord ? "selected" : ""}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
