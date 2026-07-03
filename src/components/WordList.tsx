import type { CompetitionWord } from "../../shared/spellingBee";

interface WordListProps {
  words: CompetitionWord[];
}

export default function WordList({
  words,
}: WordListProps) {
  return (
    <div className="word-list">
      <h2>Word List</h2>

      <ul>
        {words.map((word) => (
          <li
            key={word.word}
            style={{
              fontWeight: word.active ? "bold" : "normal",
              textDecoration: word.used
                ? "line-through"
                : "none",
            }}
          >
            {word.word}
          </li>
        ))}
      </ul>
    </div>
  );
}