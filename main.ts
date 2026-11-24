import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Entry for make.fun competition: One Letter: Coffee or Tea
 * (u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)
 *
 * Emits U+1D4D1 (MATHEMATICAL BOLD SCRIPT CAPITAL B: "𝓑") as our single
 * Unicode code-point choice for tea (B). U+1D4D1 is an uppercase letter
 * (\p{Lu}, NFKC "B") whose full-bodied calligraphic strokes express steeped
 * warmth and poise in one character, written with no trailing newline to
 * satisfy the strict 1-to-1 character gate.
 */
const ENTRY_GLYPH: string = '\u{1D4D1}';
const EXPECTED_BYTES: Uint8Array = Uint8Array.from([0xf0, 0x9d, 0x93, 0x91]);

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

  if (codePoints.length !== 1 || graphemes.length !== 1) {
    throw new Error(`Gate violation: codePoints=${codePoints.length}, graphemes=${graphemes.length}`);
  }
  if (decoded.trim() !== decoded || decoded.trim().length === 0) {
    throw new Error('Gate violation: output contains whitespace');
  }
  if (!/^\p{Lu}$/u.test(decoded) || decoded.normalize('NFKC') !== 'B') {
    throw new Error('Invariant violation: output is not a single uppercase letter B');
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
