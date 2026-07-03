import type { ChangeEvent } from "react";

interface WordInputProps {
  value: string;
  onChange(value: string): void;
}

export default function WordInput({
  value,
  onChange,
}: WordInputProps) {
  function handleChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ) {
    onChange(event.target.value);
  }

  return (
    <div className="word-input">
      <h2>Manual Word Input</h2>

      <textarea
        rows={10}
        value={value}
        onChange={handleChange}
        style={{ width: "100%" }}
      />
    </div>
  );
}