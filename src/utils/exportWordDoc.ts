import type { CachedWord, Pronunciation } from "../types/spellingBee.ts";
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  type ParagraphChild,
} from "docx";
import { saveAs } from "file-saver";

function formatWord(word: CachedWord): string {
  return [word.word, ...(word.alternateSpellings ?? [])].join("\n");
}

function uniquePronunciations(word: CachedWord): Pronunciation[] {
  const pronunciations = new Map<string, Pronunciation>();

  for (const meaning of word.meanings) {
    for (const pronunciation of meaning.pronunciations) {
      if (!pronunciation.audioFile && !pronunciation.audioUrl) {
        continue;
      }

      pronunciations.set(pronunciation.convertedPronunciation, pronunciation);
    }
  }

  return [...pronunciations.values()];
}

function formatPronunciations(word: CachedWord): Paragraph {
  const children: TextRun[] = [];

  uniquePronunciations(word).forEach((pronunciation, index) => {
    children.push(
      new TextRun({
        text: pronunciation.convertedPronunciation,
        break: index > 0 ? 1 : 0,
      }),
    );
  });

  return new Paragraph({
    children,
  });
}

function formatDefinitions(
  word: CachedWord,
  firstDefinitionOnly: boolean,
): Paragraph {
  const children: TextRun[] = [];

  word.meanings.forEach((meaning, meaningIndex) => {
    if (meaningIndex > 0) {
      children.push(new TextRun({ text: "", break: 2 }));
    }

    children.push(
      new TextRun({
        text: meaning.partOfSpeech,
        bold: true,
      }),
    );

    const definitions = firstDefinitionOnly
      ? meaning.definitions.slice(0, 1)
      : meaning.definitions;

    for (const definition of definitions) {
      children.push(
        new TextRun({
          text: definition.definition,
          break: 1,
        }),
      );
    }
  });

  return new Paragraph({
    children,
  });
}

function formatExample(word: CachedWord): Paragraph {
  return new Paragraph(word.example ?? "");
}

function formatAudio(word: CachedWord): Paragraph {
  const children: ParagraphChild[] = [];
  let first = true;

  for (const pronunciation of uniquePronunciations(word)) {
    if (!first) {
      children.push(new TextRun({ text: "", break: 1 }));
    }

    first = false;

    children.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: pronunciation.convertedPronunciation,
            style: "Hyperlink",
          }),
        ],
        link: pronunciation.audioUrl!,
      }),
    );
  }

  return new Paragraph({ children });
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    width: {
      size: width,
      type: WidthType.PERCENTAGE,
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
          }),
        ],
      }),
    ],
  });
}

function buildHeaderRow(): TableRow {
  return new TableRow({
    tableHeader: true,
    children: [
      headerCell("#", 5),
      headerCell("Word", 15),
      headerCell("Pronunciation", 15),
      headerCell("Definition", 30),
      headerCell("Example", 20),
      headerCell("Audio", 15),
    ],
  });
}

function tableCell(children: Paragraph[], width: number): TableCell {
  return new TableCell({
    width: {
      size: width,
      type: WidthType.PERCENTAGE,
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
    children,
  });
}

function buildWordRow(
  word: CachedWord,
  number: number,
  firstDefinitionOnly: boolean,
): TableRow {
  return new TableRow({
    cantSplit: true,
    children: [
      tableCell(
        [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun(number.toString())],
          }),
        ],
        5,
      ),

      tableCell([new Paragraph(formatWord(word))], 15),

      tableCell([formatPronunciations(word)], 15),

      tableCell([formatDefinitions(word, firstDefinitionOnly)], 30),

      tableCell([formatExample(word)], 20),

      tableCell([formatAudio(word)], 15),
    ],
  });
}

export async function exportDocx(
  words: Record<string, CachedWord>,
  firstDefinitionOnly: boolean,
) {
  const sortedWords = Object.values(words).sort((a, b) =>
    a.word.localeCompare(b.word),
  );

  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      buildHeaderRow(),
      ...sortedWords.map((word, index) =>
        buildWordRow(word, index + 1, firstDefinitionOnly),
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [table],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "SpellingBeePackage.docx");
}
