export interface Definition {
  definition: string;
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface CachedWord {
  word: string;

  audioFile?: string;
  audioUrl?: string;

  meanings: Meaning[];

  alternateSpellings: string[];
}