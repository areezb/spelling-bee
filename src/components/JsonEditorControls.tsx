import "./JsonEditorControls.css"

import { useRef } from "react";
import type { ChangeEvent } from "react";

import type { CachedWord, CompetitionPackage } from "../types/spellingBee.js";

interface EditorControlPanelProps {
  words: Record<string, CachedWord>;

  onLoadWords(packageData: CompetitionPackage): void;
  onSave(): void;
}

export default function EditorControlPanel({
  words,
  onLoadWords,
  onSave,
}: EditorControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();

      const loadedWords = JSON.parse(text) as CompetitionPackage;

      onLoadWords(loadedWords);
    } catch {
      alert("Invalid JSON file.");
    }

    // Allow selecting the same file again later.
    event.target.value = "";
  }

  function handleDownload() {
    const json = JSON.stringify({ words }, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "words.json";

    link.click();

    URL.revokeObjectURL(url);
    onSave();
  }

  return (
    <div className="control-panel">
      <h2>JSON Editor</h2>

      <button onClick={handleLoadClick}>Load JSON</button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button
        onClick={handleDownload}
        disabled={Object.keys(words).length === 0}
      >
        Download JSON
      </button>
    </div>
  );
}
