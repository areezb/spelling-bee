import "./JsonEditorPage.css";

import { useEffect, useRef, useState } from "react";
import { exportDocx } from "../utils/exportWordDoc.js";

import JSZip from "jszip";

import EditorControlPanel from "../components/JsonEditorControls.js";
import JsonWordEditor from "../components/JsonWordEditor.js";
import JsonWordList from "../components/JsonWordList.js";

import type {
  CachedWord,
  CompetitionPackage,
  CompetitionSettings,
} from "../types/spellingBee.js";
import Navbar from "../components/Navbar.tsx";

export default function JsonEditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [packageZip, setPackageZip] = useState<JSZip | null>(null);

  const [words, setWords] = useState<Record<string, CachedWord>>({});

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  function defaultCompetitionSettings(): CompetitionSettings {
    return {
      showPronunciationsWithoutAudio: false,
    };
  }

  const [settings, setSettings] = useState<CompetitionSettings>(
    defaultCompetitionSettings(),
  );

  const [dirty, setDirty] = useState(false);

  const currentWord =
    selectedWord == null ? null : (words[selectedWord] ?? null);

  const [firstDefinitionOnly, setFirstDefinitionOnly] = useState(true);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);

      const jsonFile = zip.file("words.json");

      if (!jsonFile) {
        throw new Error();
      }

      const text = await jsonFile.async("string");

      const loadedPackage = JSON.parse(text) as CompetitionPackage;

      setPackageZip(zip);

      setWords(loadedPackage.words);

      const firstWord = Object.keys(loadedPackage.words)[0];

      setSelectedWord(firstWord ?? null);

      setDirty(false);

      setSettings(loadedPackage.settings ?? defaultCompetitionSettings());
    } catch {
      alert("Invalid competition package.");
    }

    event.target.value = "";
  }

  async function handleDownload() {
    if (!packageZip) {
      return;
    }

    packageZip.file(
      "words.json",
      JSON.stringify(
        {
          settings,
          words,
        },
        null,
        2,
      ),
    );

    const blob = await packageZip.generateAsync({
      type: "blob",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "competition.zip";

    link.click();

    URL.revokeObjectURL(url);

    setDirty(false);
  }

  async function handleDownloadDocx() {
    await exportDocx(words, firstDefinitionOnly);
  }

  function handleWordChange(originalWord: string, updatedWord: CachedWord) {
    setWords((previous) => {
      if (originalWord !== updatedWord.word && previous[updatedWord.word]) {
        alert("A word with that name already exists.");
        return previous;
      }

      const next = { ...previous };

      delete next[originalWord];

      next[updatedWord.word] = updatedWord;

      return next;
    });

    setSelectedWord(updatedWord.word);
    setDirty(true);
  }

  function handleAddWord() {
    const baseName = "new-word";

    let name = baseName;
    let counter = 2;

    while (words[name]) {
      name = `${baseName}-${counter++}`;
    }

    const newWord: CachedWord = {
      word: name,
      meanings: [],
      example: "",
      alternateSpellings: [],
    };

    setWords((previous) => ({
      ...previous,
      [name]: newWord,
    }));

    setSelectedWord(name);
    setDirty(true);
  }

  function handleDeleteWord(wordName: string) {
    setWords((previous) => {
      const next = { ...previous };

      delete next[wordName];

      if (selectedWord === wordName) {
        const remaining = Object.keys(next).sort();

        setSelectedWord(remaining[0] ?? null);
      }

      return next;
    });

    setDirty(true);
  }

  function handleSettingsChange(changes: Partial<CompetitionSettings>) {
    setSettings((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  return (
    <>
      <Navbar />
      <div className="editor-page">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <EditorControlPanel
          canDownload={packageZip !== null}
          firstDefinitionOnly={firstDefinitionOnly}
          onLoad={handleLoadClick}
          onDownload={handleDownload}
          onDownloadDocx={handleDownloadDocx}
          onFirstDefinitionOnlyChange={setFirstDefinitionOnly}
        />

        <JsonWordEditor
          word={currentWord}
          onChange={handleWordChange}
          onDelete={handleDeleteWord}
        />

        <JsonWordList
          words={words}
          settings={settings}
          selectedWord={selectedWord}
          onSelectWord={setSelectedWord}
          onAddWord={handleAddWord}
          handleSettingsChange={handleSettingsChange}
        />
      </div>
    </>
  );
}
