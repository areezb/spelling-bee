export interface Definition {
  definition: string;
}

export interface Pronunciation {
  pronunciation: string;
  audioFile?: string;
  audioUrl?: string;
  playbackAudio?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  pronunciations: Pronunciation[];
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
