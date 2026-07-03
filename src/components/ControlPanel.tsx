import { useRef } from "react";
import type { ChangeEvent } from "react";

interface ControlPanelProps {
  canLoadWords: boolean;
  randomWordEnabled: boolean;
  currentWordActive: boolean;

  onUploadPackage(file: File): void;
  onLoadWords(): void;

  onRandomWord(): void;
  onCorrect(): void;
  onIncorrect(): void;
  onEndRound(): void;
}

export default function ControlPanel({
  canLoadWords,
  randomWordEnabled,
  currentWordActive,

  onUploadPackage,
  onLoadWords,

  onRandomWord,
  onCorrect,
  onIncorrect,
  onEndRound,
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUploadPackage(file);

    // Allow the user to pick the same file again later.
    event.target.value = "";
  }

  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <h3>Competition Package</h3>

      <button onClick={handleUploadClick}>
        Load Package
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <hr />

      <h3>Manual Words</h3>

      <button
        onClick={onLoadWords}
        disabled={!canLoadWords}
      >
        Load Words
      </button>

      <hr />

      <h3>Competition</h3>

      <button
        onClick={onRandomWord}
        disabled={!randomWordEnabled}
      >
        Random Word
      </button>

      <br />
      <br />

      <button
        onClick={onCorrect}
        disabled={!currentWordActive}
      >
        Correct
      </button>

      <button
        onClick={onIncorrect}
        disabled={!currentWordActive}
        style={{ marginLeft: "0.5rem" }}
      >
        Incorrect
      </button>

      <br />
      <br />

      <button
        onClick={onEndRound}
        disabled={!currentWordActive}
      >
        End Round
      </button>
    </div>
  );
}