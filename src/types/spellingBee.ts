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

  meanings: Meaning[];

  alternateSpellings?: string[];

  audioFile?: string;

  audioUrl?: string;
}

export interface CompetitionWord extends CachedWord {
  used: boolean;
  active: boolean;
}

export interface CompetitionPackage {
  version: number;
  words: Record<string, CachedWord>;
}