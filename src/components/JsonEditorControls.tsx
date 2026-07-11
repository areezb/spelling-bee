import "./JsonEditorControls.css";

interface EditorControlPanelProps {
  canDownload: boolean;
  firstDefinitionOnly: boolean;

  onLoad(): void;
  onDownload(): void;
  onDownloadDocx(): void;
  onFirstDefinitionOnlyChange(value: boolean): void;
}

export default function EditorControlPanel({
  canDownload,
  firstDefinitionOnly,
  onLoad,
  onDownload,
  onDownloadDocx,
  onFirstDefinitionOnlyChange,
}: EditorControlPanelProps) {
  return (
    <div className="editor-control-panel">
      <h2>Package Editor</h2>

      <section>
        <button onClick={onLoad}>Load Package (.zip)</button>

        <button onClick={onDownload} disabled={!canDownload}>
          Save Package (.zip)
        </button>
      </section>

      <hr />

      <section>
        <button onClick={onDownloadDocx} disabled={!canDownload}>
          Download Student Study Sheet (.docx)
        </button>

        <label className="editor-checkbox">
          <input
            type="checkbox"
            checked={firstDefinitionOnly}
            onChange={(event) =>
              onFirstDefinitionOnlyChange(event.target.checked)
            }
          />
          First definition per part of speech only
        </label>
      </section>
    </div>
  );
}
