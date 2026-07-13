import Navbar from "../components/Navbar.tsx";
import "./DevPage.css";

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

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          words,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const failedWords =
        response.headers.get("X-Failed-Words")?.split(",").filter(Boolean) ??
        [];

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "competition.zip";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      if (failedWords.length > 0) {
        alert(
          "Package generated.\n\n" +
            "No information was found for the following words:\n\n" +
            failedWords.join("\n") +
            "\n\nThese words were added as blank entries. Use the Package Builder to complete them manually.",
        );
      } else {
        alert("Package successfully generated.");
      }
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
    <>
      <Navbar />
      <div className="dev-page">
        <h1>Package Builder</h1>

        <p className="subtitle">
          Generate a complete spelling bee package from a list of words.
        </p>

        <label>Merriam-Webster API Key</label>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <p>Your Merriam-Webster API Key is never stored by this application.</p>

        <label>Words (one per line)</label>

        <textarea
          rows={20}
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || apiKey.trim() === "" || wordInput.trim() === ""}
        >
          {loading ? "Generating Package..." : "Generate Package"}
        </button>
      </div>
    </>
  );
}
