export enum Phoneme {
  // ======================================================
  // Vowels
  // ======================================================

  A,
  A_MACRON,
  A_DIAERESIS,

  E,
  E_MACRON,

  I,
  I_MACRON,

  O,
  O_MACRON,
  O_DOT,

  U,
  U_DIAERESIS,
  U_DOT,

  SCHWA,

  // ======================================================
  // R-Colored Vowels
  // ======================================================

  SCHWA_R, // ər
  E_R, // er
  I_R, // ir
  A_DIAERESIS_R, // är
  O_DOT_R, // ȯr
  U_DOT_R, // u̇r

  // ======================================================
  // Diphthongs
  // ======================================================

  AU_DOT, // au̇
  O_DOT_I, // ȯi

  // ======================================================
  // Consonants
  // ======================================================

  CH,
  SH,
  TH,
  ZH,
  NG,
  HW,

  // ======================================================
  // Foreign Sounds
  // ======================================================

  GERMAN_CH,
  FRENCH_EU,
  FRENCH_U,
}

export enum Marker {
  PRIMARY_STRESS,
  SECONDARY_STRESS,
  SYLLABLE_BREAK,

  OPTIONAL_START,
  OPTIONAL_END,

  VARIANT_SEPARATOR,
  DISCOURAGED_VARIANT,
}

interface LiteralToken {
  type: "literal";
  value: string;
}

interface PhonemeToken {
  type: "phoneme";
  value: Phoneme;
}

interface MarkerToken {
  type: "marker";
  value: Marker;
}

export type Token = LiteralToken | PhonemeToken | MarkerToken;

interface PhonemeRule {
  mw: string;
  token: Phoneme;
}

interface MarkerRule {
  mw: string;
  token: Marker;
}

const PHONEME_RULES: PhonemeRule[] = [
  // ======================================================
  // R-Colored Vowels
  // ======================================================

  { mw: "u̇r", token: Phoneme.U_DOT_R },
  { mw: "ər", token: Phoneme.SCHWA_R },
  { mw: "är", token: Phoneme.A_DIAERESIS_R },
  { mw: "ȯr", token: Phoneme.O_DOT_R },
  { mw: "ir", token: Phoneme.I_R },
  { mw: "er", token: Phoneme.E_R },

  // ======================================================
  // Diphthongs
  // ======================================================

  { mw: "au̇", token: Phoneme.AU_DOT },
  { mw: "ȯi", token: Phoneme.O_DOT_I },

  // ======================================================
  // Consonant Digraphs
  // ======================================================

  { mw: "ch", token: Phoneme.CH },
  { mw: "sh", token: Phoneme.SH },
  { mw: "th", token: Phoneme.TH },
  { mw: "zh", token: Phoneme.ZH },
  { mw: "hw", token: Phoneme.HW },

  // ======================================================
  // Special Consonants
  // ======================================================

  { mw: "ŋ", token: Phoneme.NG },
  { mw: "ḵ", token: Phoneme.GERMAN_CH },

  // ======================================================
  // Long Vowels
  // ======================================================

  { mw: "ā", token: Phoneme.A_MACRON },
  { mw: "ē", token: Phoneme.E_MACRON },
  { mw: "ī", token: Phoneme.I_MACRON },
  { mw: "ō", token: Phoneme.O_MACRON },
  { mw: "ü", token: Phoneme.U_DIAERESIS },

  // ======================================================
  // Simple Vowels
  // ======================================================

  { mw: "ä", token: Phoneme.A_DIAERESIS },
  { mw: "a", token: Phoneme.A },

  { mw: "e", token: Phoneme.E },

  { mw: "i", token: Phoneme.I },

  { mw: "ȯ", token: Phoneme.O_DOT },
  { mw: "o", token: Phoneme.O },

  { mw: "u̇", token: Phoneme.U_DOT },
  { mw: "u", token: Phoneme.U },

  { mw: "ə", token: Phoneme.SCHWA },
].sort((a, b) => b.mw.length - a.mw.length);

const MARKER_RULES: MarkerRule[] = [
  { mw: "ˈ", token: Marker.PRIMARY_STRESS },
  { mw: "ˌ", token: Marker.SECONDARY_STRESS },
  { mw: "-", token: Marker.SYLLABLE_BREAK },
  { mw: "(", token: Marker.OPTIONAL_START },
  { mw: ")", token: Marker.OPTIONAL_END },
  { mw: ",", token: Marker.VARIANT_SEPARATOR },
  { mw: "÷", token: Marker.DISCOURAGED_VARIANT },
];

function makeLiteralToken(value: string): LiteralToken {
  return { type: "literal", value };
}

function makePhonemeToken(value: Phoneme): PhonemeToken {
  return { type: "phoneme", value };
}

function makeMarkerToken(value: Marker): MarkerToken {
  return { type: "marker", value };
}

function readPhoneme(input: string, index: number): PhonemeRule | null {
  for (const rule of PHONEME_RULES) {
    if (input.startsWith(rule.mw, index)) {
      return rule;
    }
  }

  return null;
}

function readMarker(input: string, index: number): MarkerRule | null {
  for (const rule of MARKER_RULES) {
    if (input.startsWith(rule.mw, index)) {
      return rule;
    }
  }

  return null;
}

function normalizeMwPronunciation(input: string): string {
    return input
        .replaceAll("ᵊl", "əl")
        .replaceAll("ᵊm", "əm")
        .replaceAll("ᵊn", "ən")
        .replaceAll("ᵊŋ", "əŋ")
        .replaceAll("ᵊ", "ə")
        .replaceAll("ʸ", "");
}

export function lex(input: string): Token[] {
  const out: Token[] = [];

  const normalized_input = normalizeMwPronunciation(input);

  for (let i = 0; i < normalized_input.length; ) {
    const phoneme = readPhoneme(normalized_input, i);

    if (phoneme) {
      out.push(makePhonemeToken(phoneme.token));
      i += phoneme.mw.length;
      continue;
    }

    const marker = readMarker(normalized_input, i);

    if (marker) {
      out.push(makeMarkerToken(marker.token));
      i += marker.mw.length;
      continue;
    }

    out.push(makeLiteralToken(normalized_input[i]));
    i++;
  }

  return out;
}

function simplify(tokens: Token[]): Token[] {
  const out: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    // Remove () that contain only secondary stress.
    if (
      i + 2 < tokens.length &&
      tokens[i].type === "marker" &&
      tokens[i].value === Marker.OPTIONAL_START &&
      tokens[i + 1].type === "marker" &&
      tokens[i + 1].value === Marker.SECONDARY_STRESS &&
      tokens[i + 2].type === "marker" &&
      tokens[i + 2].value === Marker.OPTIONAL_END
    ) {
      i += 2;
      continue;
    }

    out.push(tokens[i]);
  }

  return out;
}

const PHONEME_RENDER: Record<Phoneme, string> = {
  [Phoneme.A]: "a",
  [Phoneme.A_MACRON]: "ay",
  [Phoneme.A_DIAERESIS]: "ah",

  [Phoneme.E]: "eh",
  [Phoneme.E_MACRON]: "ee",

  [Phoneme.I]: "ih",
  [Phoneme.I_MACRON]: "eye",

  [Phoneme.O]: "ah",
  [Phoneme.O_MACRON]: "oh",
  [Phoneme.O_DOT]: "aw",

  [Phoneme.U]: "uh",
  [Phoneme.U_DIAERESIS]: "oo",
  [Phoneme.U_DOT]: "uu",

  [Phoneme.SCHWA]: "uh",

  [Phoneme.SCHWA_R]: "er",
  [Phoneme.E_R]: "air",
  [Phoneme.I_R]: "ear",
  [Phoneme.A_DIAERESIS_R]: "ar",
  [Phoneme.O_DOT_R]: "or",
  [Phoneme.U_DOT_R]: "oor",

  [Phoneme.AU_DOT]: "ow",
  [Phoneme.O_DOT_I]: "oy",

  [Phoneme.CH]: "ch",
  [Phoneme.SH]: "sh",
  [Phoneme.TH]: "th",
  [Phoneme.ZH]: "zh",
  [Phoneme.NG]: "ng",
  [Phoneme.HW]: "hw",

  [Phoneme.GERMAN_CH]: "kh",
  [Phoneme.FRENCH_EU]: "eu",
  [Phoneme.FRENCH_U]: "ü",
};

export function render(tokens: Token[]): string {
  let output = "";
  let capitalizeCurrSyll = false;
  const syllableCount =
    1 +
    tokens.filter(
      (t) => t.type === "marker" && t.value === Marker.SYLLABLE_BREAK,
    ).length;
  const showStress = syllableCount > 1;

  function append(text: string) {
    if (capitalizeCurrSyll && text.length > 0) {
      output += text.toUpperCase();
    } else {
      output += text;
    }
  }

  for (const token of tokens) {
    switch (token.type) {
      case "literal":
        append(token.value);
        break;

      case "phoneme":
        append(PHONEME_RENDER[token.value]);
        break;

      case "marker":
        switch (token.value) {
          case Marker.PRIMARY_STRESS:
            if (showStress) {
              capitalizeCurrSyll = true;
            }
            break;

          case Marker.SECONDARY_STRESS:
            break;

          case Marker.SYLLABLE_BREAK:
            output += "-";
            capitalizeCurrSyll = false;
            break;

          case Marker.OPTIONAL_START:
            output += "(";
            break;

          case Marker.OPTIONAL_END:
            output += ")";
            break;

          case Marker.VARIANT_SEPARATOR:
            output += " / ";
            break;

          case Marker.DISCOURAGED_VARIANT:
            break;
        }
        break;
    }
  }

  return output;
}

export function convertMwPronunciation(input: string): string {
  return render(simplify(lex(input)));
}
