import "./JsonEditorControls.css";

interface EditorControlPanelProps {
  canDownload: boolean;

  onLoad(): void;

  onDownload(): void;
}

export default function EditorControlPanel({
  canDownload,
  onLoad,
  onDownload,
}: EditorControlPanelProps) {
  return (
    <div className="control-panel">
      <h2>JSON Editor</h2>

      <button onClick={onLoad}>
        Load Package
      </button>

      <br />
      <br />

      <button
        onClick={onDownload}
        disabled={!canDownload}
      >
        Save Package
      </button>
    </div>
  );
}