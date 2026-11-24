import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Entry for make.fun competition: One Letter: Coffee or Tea
 * (u-rusdyxbt-one-letter-coffee-or-tea-89877fa0)
 *
 * Emits U+212C (SCRIPT CAPITAL B: "ℬ") as our single-character UTF-8 choice
 * for tea (B). U+212C is the sole calligraphic BMP uppercase letter (\p{Lu},
 * NFKC "B") with utf16 length = 1 and code point count = 1, written with no
 * trailing newline to satisfy the strict 1-to-1 character gate.
 */
const ENTRY_GLYPH: string = '\u212C';
const EXPECTED_BYTES: Uint8Array = Uint8Array.from([0xe2, 0x84, 0xac]);

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

  if (decoded.length !== 1 || codePoints.length !== 1) {
    throw new Error(`Gate violation: utf16=${decoded.length}, codePoints=${codePoints.length}`);
  }
  if (decoded.trim().length !== 1) {
    throw new Error('Gate violation: output is whitespace');
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
