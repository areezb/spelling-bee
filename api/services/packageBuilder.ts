import JSZip from "jszip";

import {
  downloadAudio,
  fetchWordFromMerriam,
} from "./merriamWebster.js";

import { fetchExampleSentence } from "./exampleSentence.js";

import type {
  CachedWord,
  CompetitionPackage,
} from "../../src/types/spellingBee.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildCompetitionPackage(
  words: string[],
  apiKey: string,
): Promise<Buffer> {
  const zip = new JSZip();

  const cache: Record<string, CachedWord> = {};

  for (const word of words) {
    console.log(`Loading ${word}...`);

    try {
      const cachedWord = await fetchWordFromMerriam(
        word,
        apiKey,
      );

      const exampleSentence =
        await fetchExampleSentence(cachedWord.word);

      if (exampleSentence) {
        cachedWord.example = exampleSentence;
      }

      cache[cachedWord.word] = cachedWord;

      if (
        cachedWord.audioUrl &&
        cachedWord.audioFile
      ) {
        const audio = await downloadAudio(
          cachedWord.audioUrl,
        );

        zip.file(
          `audio/${cachedWord.audioFile}`,
          audio,
        );
      }

      await sleep(50);
    } catch (error) {
      console.error(
        `Failed to load ${word}`,
        error,
      );
    }
  }

  if (Object.keys(cache).length === 0) {
    throw new Error(
      "No valid words were found.",
    );
  }

  const competitionPackage: CompetitionPackage = {
    words: cache,
  };

  zip.file(
    "words.json",
    JSON.stringify(
      competitionPackage,
      null,
      2,
    ),
  );

  return await zip.generateAsync({
    type: "nodebuffer",
  });
}