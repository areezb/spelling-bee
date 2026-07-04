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
    <div className="editor-control-panel">
      <h2>JSON Editor</h2>

      <section>
        <button onClick={onLoad}>Load Package</button>

        <button onClick={onDownload} disabled={!canDownload}>
          Save Package
        </button>
      </section>
    </div>
  );
}