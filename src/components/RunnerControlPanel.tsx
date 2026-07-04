import "./RunnerControlPanel.css"

import { useRef } from "react";
import type { ChangeEvent } from "react";

interface ControlPanelProps {
  randomWordEnabled: boolean;
  currentWordActive: boolean;

  onUploadPackage(file: File): void;

  onRandomWord(): void;
  onCorrect(): void;
  onEndRound(): void;
}

export default function ControlPanel({
  randomWordEnabled,
  currentWordActive,

  onUploadPackage,

  onRandomWord,
  onCorrect,
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

    // Allow selecting the same file again later.
    event.target.value = "";
  }

  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <h3>Package</h3>

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
        onClick={onEndRound}
        disabled={!currentWordActive}
        style={{ marginLeft: "0.5rem" }}
      >
        End Round
      </button>
    </div>
  );
}