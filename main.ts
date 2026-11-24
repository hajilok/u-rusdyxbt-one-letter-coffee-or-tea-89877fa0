import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Entry for make.fun competition: One Letter: Coffee or Tea
 * (u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)
 *
 * Emits U+00C4 (LATIN CAPITAL LETTER A WITH DIAERESIS: "Ä") as our single
 * BMP UTF-8 character choice for coffee (A). U+00C4 is a 2-byte uppercase
 * Latin letter (\p{Lu}, utf16=1, codePoints=1, graphemes=1) whose NFKC
 * lowercase form ("ä") avoids server identical_text collision with plain "A"/"B"
 * while delivering wide-eyed caffeinated visual wit in one character.
 */
const ENTRY_GLYPH: string = '\u00C4';
const EXPECTED_BYTES: Uint8Array = Uint8Array.from([0xc3, 0x84]);

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return configured && configured.length > 0 ? configured : '/output';
}

function assertGateInvariants(bytes: Uint8Array): void {
  if (bytes.length !== EXPECTED_BYTES.length) {
    throw new Error(`Expected ${EXPECTED_BYTES.length} UTF-8 bytes, got ${bytes.length}`);
  }
  for (let i = 0; i < EXPECTED_BYTES.length; i++) {
    if (bytes[i] !== EXPECTED_BYTES[i]) {
      throw new Error(`Unexpected byte at offset ${i}: 0x${bytes[i]!.toString(16)}`);
    }
  }

  const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
  const decoded = decoder.decode(bytes);
  const codePoints = [...decoded];
  const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(decoded)];

  if (decoded.length !== 1 || codePoints.length !== 1 || graphemes.length !== 1) {
    throw new Error(`Gate violation: utf16=${decoded.length}, codePoints=${codePoints.length}, graphemes=${graphemes.length}`);
  }
  if (decoded.trim() !== decoded || decoded.trim().length === 0) {
    throw new Error('Gate violation: output contains whitespace');
  }
  if (!/^\p{Lu}$/u.test(decoded)) {
    throw new Error('Invariant violation: output is not a single uppercase letter');
  }
  if (decoded.codePointAt(0) !== 0x00c4 || decoded.normalize('NFC') !== decoded) {
    throw new Error('Invariant violation: output is not precomposed U+00C4');
  }
  if (decoded.normalize('NFD')[0] !== 'A') {
    throw new Error('Invariant violation: base Latin letter is not A');
  }
  const nfkcLower = decoded.normalize('NFKC').toLowerCase();
  if (nfkcLower === 'a' || nfkcLower === 'b') {
    throw new Error(`Anti-collision violation: NFKC lowercase "${nfkcLower}" collides with plain A/B`);
  }
}

function main(): void {
  const payload = Buffer.from(ENTRY_GLYPH, 'utf8');
  assertGateInvariants(payload);

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'entry.txt');
  writeFileSync(outputPath, payload, { mode: 0o644 });
  chmodSync(outputPath, 0o644);

  const written = readFileSync(outputPath);
  assertGateInvariants(written);
}

main();
