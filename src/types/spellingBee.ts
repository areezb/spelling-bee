export interface Definition {
  definition: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface CachedWord {
  word: string;

  meanings: Meaning[];

  example?: string;

  alternateSpellings?: string[];

  audioFile?: string;

  audioUrl?: string;
}

export interface CompetitionWord extends CachedWord {
  used: boolean;
  active: boolean;
}

export interface CompetitionPackage {
  words: Record<string, CachedWord>;
}