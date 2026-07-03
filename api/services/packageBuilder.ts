import JSZip from "jszip";

import { fetchWordFromMerriam, downloadAudio } from "./merriamWebster";

import type { CachedWord } from "../../types/spellingBee";

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
      const cachedWord = await fetchWordFromMerriam(word, apiKey);

      cache[word] = cachedWord;

      if (cachedWord.audioUrl && cachedWord.audioFile) {
        const audio = await downloadAudio(cachedWord.audioUrl);

        zip.file(`audio/${cachedWord.audioFile}`, audio);
      }
      await sleep(50);
    } catch (error) {
      console.error(`Failed to load ${word}`, error);
    }
  }

  if (Object.keys(cache).length === 0) {
    throw new Error("No valid words were found.");
  }

  zip.file("cache.json", JSON.stringify(cache, null, 2));

  return await zip.generateAsync({
    type: "nodebuffer",
  });
}
