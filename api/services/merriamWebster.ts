import type { CachedWord, Meaning } from "../../src/types/spellingBee.js";

const BASE_URL =
  "https://www.dictionaryapi.com/api/v3/references/collegiate/json";

interface MerriamWebsterEntry {
  meta: {
    id: string;
  };

  hwi?: {
    hw?: string;

    prs?: {
      mw?: string;

      sound?: {
        audio: string;
      };
    }[];
  };

  fl?: string;

  shortdef?: string[];

  cxs?: {
    cxl: string;

    cxtis?: {
      cxt: string;
    }[];
  }[];
}

function getAudioUrl(audio: string): string {
  let subdirectory: string;

  if (audio.startsWith("bix")) {
    subdirectory = "bix";
  } else if (audio.startsWith("gg")) {
    subdirectory = "gg";
  } else if (/^[0-9]/.test(audio)) {
    subdirectory = "number";
  } else {
    subdirectory = audio[0] as string;
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio}.mp3`;
}

export async function fetchWordFromMerriam(
  word: string,
  apiKey: string,
): Promise<CachedWord> {
  const response = await fetch(
    `${BASE_URL}/${encodeURIComponent(word)}?key=${apiKey}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch "${word}"`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No entry found for "${word}"`);
  }

  if (typeof data[0] === "string") {
    throw new Error(`"${word}" was not found.`);
  }

  const entries = data as MerriamWebsterEntry[];

  const dictionaryEntries = entries.filter(
    (entry) => entry.fl && entry.shortdef && entry.shortdef.length > 0,
  );

  const variantEntries = entries.filter(
    (entry) => !dictionaryEntries.includes(entry),
  );

  const meanings: Meaning[] = dictionaryEntries.map((entry) => ({
    partOfSpeech: entry.fl!,
    definitions: entry.shortdef!.map((definition) => ({
      definition,
    })),
  }));

  const alternateSpellings = variantEntries
    .filter((entry) =>
      entry.cxs?.some((cx) => cx.cxl.toLowerCase().includes("spelling of")),
    )
    .map((entry) => entry.meta.id);

  const first = dictionaryEntries[0];

  if (!first) {
    throw new Error(`No usable entry found for "${word}".`);
  }
  const wordname = first.meta.id
  const displayWord = first.hwi?.hw?.replace(/\*/g, "") ?? wordname;

  const audioId = first.hwi?.prs?.[0]?.sound?.audio;

  return {
    word: displayWord,

    ...(audioId && {
      audioFile: `${audioId}.mp3`,
      audioUrl: getAudioUrl(audioId),
    }),

    meanings,
    alternateSpellings,
  };
}

export async function downloadAudio(audioUrl: string): Promise<Buffer> {
  const response = await fetch(audioUrl);

  if (!response.ok) {
    throw new Error("Failed to download audio.");
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}
