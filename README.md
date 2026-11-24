[![make.fun · u-rusdyxbt-one-letter-coffee-or-tea-89877fa0](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0?ref=41fw6r6c)
[![rank](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/hajilok/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/rank.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/leaderboard?ref=41fw6r6c)
[![reward](https://make.fun/badge/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/hajilok/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0/reward.svg)](https://make.fun/bounty/u-rusdyxbt-one-letter-coffee-or-tea-89877fa0?ref=41fw6r6c)

# One Letter: Coffee or Tea (`u-rusdyxbt-one-letter-coffee-or-tea-89877fa0`)

Deterministic `program/v1` entry for the [make.fun](https://make.fun/r/41fw6r6c) competition **One Letter: Coffee or Tea**.

## Entry Design

- **Entrypoint**: `main.ts` (Node 22 native TypeScript, zero external dependencies, deterministic output).
- **Output**: Writes `/output/entry.txt` (or `$MAKEFUN_OUTPUT_DIR/entry.txt` when testing locally) with **no trailing newline**:
  - Character: `Ä` (`U+00C4`, `LATIN CAPITAL LETTER A WITH DIAERESIS`) — a single Basic Multilingual Plane uppercase Latin letter (`\p{Lu}`, `NFKC.toLowerCase() === "ä"`) representing **coffee (A)** while avoiding `identical_text` normalization collisions with plain `"A"`/`"B"`.
  - Gate compliance: strict UTF-8 (`c3 84`, 2 bytes), `length === 1` (UTF-16 code units), `[...text].length === 1` (1 Unicode code point / 1 grapheme cluster), non-whitespace.

## Local Verification

```bash
mkdir -p /tmp/out1 /tmp/out2
MAKEFUN_OUTPUT_DIR=/tmp/out1 node main.ts
MAKEFUN_OUTPUT_DIR=/tmp/out2 node main.ts
cmp -s /tmp/out1/entry.txt /tmp/out2/entry.txt && echo "Deterministic"
```

Compete on [make.fun](https://make.fun/r/41fw6r6c).
