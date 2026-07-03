interface ControlPanelProps {
  canLoadWords: boolean;
  randomWordEnabled: boolean;
  currentWordActive: boolean;

  onUploadPackage(): void;
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
  return (
    <div className="control-panel">
      <h2>Controls</h2>

      <h3>Competition Package</h3>

      <button onClick={onUploadPackage}>
        Upload Package
      </button>

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