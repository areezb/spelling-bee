import JSZip from "jszip";

import { downloadAudio, fetchWordFromMerriam } from "./merriamWebster.js";

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

  const downloadedAudio = new Set<string>();

  for (const word of words) {
    console.log(`Loading ${word}...`);

    try {
      const cachedWord = await fetchWordFromMerriam(word, apiKey);

      const exampleSentence = await fetchExampleSentence(cachedWord.word);

      if (exampleSentence) {
        cachedWord.example = exampleSentence;
      }

      cache[cachedWord.word] = cachedWord;

      for (const meaning of cachedWord.meanings) {
        for (const pronunciation of meaning.pronunciations) {
          if (
            !pronunciation.audioUrl ||
            !pronunciation.audioFile ||
            downloadedAudio.has(pronunciation.audioFile)
          ) {
            continue;
          }

          const audio = await downloadAudio(pronunciation.audioUrl);

          zip.file(`audio/${pronunciation.audioFile}`, audio);

          downloadedAudio.add(pronunciation.audioFile);
        }
      }

      await sleep(50);
    } catch (error) {
      console.error(`Failed to load ${word}`, error);

      failedWords.push(word);

      cache[word] = {
        word,
        meanings: [],
        example: "",
        alternateSpellings: [],
      };
    }
  }

  const competitionPackage: CompetitionPackage = {
    words: cache,
    settings: {
      showPronunciationsWithoutAudio: false,
    }
  };

  zip.file("words.json", JSON.stringify(competitionPackage, null, 2));

  return {
    zip: await zip.generateAsync({
      type: "nodebuffer",
    }),
    failedWords,
  };
}
