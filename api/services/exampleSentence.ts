interface DictionaryApiDefinition {
  example?: string;
}

interface DictionaryApiMeaning {
  definitions: DictionaryApiDefinition[];
}

interface DictionaryApiEntry {
  meanings: DictionaryApiMeaning[];
}

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

function isSentence(text: string): boolean {
  const trimmed = text.trim();

  return /[.!?]$/.test(trimmed);
}

export async function fetchExampleSentence(
  word: string,
): Promise<string | undefined> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(word)}`);

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return undefined;
  }

  const entries = data as DictionaryApiEntry[];

  for (const entry of entries) {
    for (const meaning of entry.meanings) {
      for (const definition of meaning.definitions) {
        if (definition.example &&
          isSentence(definition.example)) {
          return definition.example;
        }
      }
    }
  }

  return undefined;
}
