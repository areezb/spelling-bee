import type {
  CachedWord,
  Meaning,
  Pronunciation,
} from "../../src/types/spellingBee.js";

import { convertMwPronunciation } from "../../src/utils/pronunciation.js";

const BASE_URL =
  "https://www.dictionaryapi.com/api/v3/references/collegiate/json";

interface MerriamWebsterPronunciation {
  mw?: string;

  sound?: {
    audio: string;
  };
}

interface MerriamWebsterEntry {
  meta: {
    id: string;
  };

  hwi?: {
    hw?: string;

    prs?: MerriamWebsterPronunciation[];
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
    subdirectory = audio[0];
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio}.mp3`;
}

function buildPronunciations(
  prs: MerriamWebsterPronunciation[],
): Pronunciation[] {
  const pronunciations: Pronunciation[] = [];

  for (const pr of prs) {
    const mw = pr.mw ?? "";

    // Continuation of the previous pronunciation
    if (mw.startsWith("-") && pronunciations.length > 0) {
      const previous = pronunciations[pronunciations.length - 1];

      previous.mwPronunciation += mw.slice(1);
      previous.convertedPronunciation = convertMwPronunciation(
        previous.mwPronunciation,
      );

      // If the continuation happens to contain audio, keep it.
      if (pr.sound?.audio) {
        previous.audioFile = `${pr.sound.audio}.mp3`;
        previous.audioUrl = getAudioUrl(pr.sound.audio);
      }

      continue;
    }

    pronunciations.push({
      mwPronunciation: mw,
      convertedPronunciation: convertMwPronunciation(mw),
      audioFile: pr.sound?.audio ? `${pr.sound.audio}.mp3` : undefined,
      audioUrl: pr.sound?.audio ? getAudioUrl(pr.sound.audio) : undefined,
    });
  }

  return pronunciations;
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
    throw new Error(`No entry found for "${word}".`);
  }

  if (typeof data[0] === "string") {
    throw new Error(`"${word}" was not found.`);
  }

  const entries = data as MerriamWebsterEntry[];

  const normalizedWord = word.toLowerCase();

  const dictionaryEntries = entries.filter((entry) => {
    const id = entry.meta.id.split(":")[0].toLowerCase();

    return (
      id === normalizedWord &&
      entry.fl &&
      entry.shortdef &&
      entry.shortdef.length > 0
    );
  });

  if (dictionaryEntries.length === 0) {
    throw new Error(`No usable entry found for "${word}".`);
  }

  const alternateSpellings = entries
    .filter((entry) =>
      entry.cxs?.some((cx) => cx.cxl.toLowerCase().includes("spelling of")),
    )
    .map((entry) => entry.meta.id);

  const meanings: Meaning[] = dictionaryEntries.map((entry) => ({
    partOfSpeech: entry.fl!,
    definitions: entry.shortdef!.map((definition) => ({
      definition,
    })),
    pronunciations: buildPronunciations(entry.hwi?.prs ?? []),
  }));

  const firstEntry = dictionaryEntries[0];

  const displayWord =
    firstEntry.hwi?.hw?.replace(/\*/g, "") ?? firstEntry.meta.id;

  const audioId = firstEntry.hwi?.prs?.[0]?.sound?.audio;

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
