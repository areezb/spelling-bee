import "./RunnerWordList.css";

import type { CompetitionWord } from "../types/spellingBee.ts";

interface WordListProps {
  words: CompetitionWord[];
}

export default function WordList({ words }: WordListProps) {
  const sortedWords = [...words].sort((a, b) =>
    a.word.localeCompare(b.word, undefined, {
      sensitivity: "base",
    }),
  );

  return (
    <div className="runner-word-list">
      <h2>Word List</h2>

      <ul>
        {sortedWords.map((word) => (
          <li
            key={word.word}
            style={{
              fontWeight: word.active ? "bold" : "normal",
              textDecoration: word.used ? "line-through" : "none",
            }}
          >
            {word.word}
          </li>
        ))}
      </ul>
    </div>
  );
}
