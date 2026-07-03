import { useState } from "react";

const API_URL = "/api/generate-package";

export default function DevPage() {
  const [apiKey, setApiKey] = useState("");

  const [wordInput, setWordInput] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    try {
      const words = wordInput
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey,
            words,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "competition.zip";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to generate package.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Package Builder</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Merriam-Webster API Key</label>
        <br />
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Words (one per line)</label>
        <br />
        <textarea
          rows={20}
          style={{ width: "100%" }}
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || apiKey.trim() === "" || wordInput.trim() === ""}
      >
        {loading ? "Generating..." : "Generate Package"}
      </button>
    </div>
  );
}
