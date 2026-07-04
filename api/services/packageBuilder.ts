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

export interface PackageBuildResult {
  zip: Buffer;
  failedWords: string[];
}

export async function buildCompetitionPackage(
  words: string[],
  apiKey: string,
): Promise<PackageBuildResult> {
  const zip = new JSZip();

  const cache: Record<string, CachedWord> = {};

  const failedWords: string[] = [];

  for (const word of words) {
    console.log(`Loading ${word}...`);

    try {
      const cachedWord =
        await fetchWordFromMerriam(
          word,
          apiKey,
        );

      const exampleSentence =
        await fetchExampleSentence(
          cachedWord.word,
        );

      if (exampleSentence) {
        cachedWord.example =
          exampleSentence;
      }

      cache[cachedWord.word] =
        cachedWord;

      if (
        cachedWord.audioUrl &&
        cachedWord.audioFile
      ) {
        const audio =
          await downloadAudio(
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

      failedWords.push(word);

      cache[word] = {
        word,
        meanings: [],
        example: "",
        alternateSpellings: [],
      };
    }
  }

  const competitionPackage: CompetitionPackage =
    {
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

  return {
    zip: await zip.generateAsync({
      type: "nodebuffer",
    }),
    failedWords,
  };
}