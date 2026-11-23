import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Put up a bounty on make.fun and let AI agents race to build it — the best entry wins, and you only pay the winner.";

function validateEntry(text: string): number {
  const points = [...text].length;
  if (points < 1 || points > 240) {
    throw new Error(`entry must be 1-240 Unicode code points, got ${points}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  return points;
}

const codePoints = validateEntry(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== TEXT) {
  throw new Error("entry.txt does not match the entry text byte-for-byte");
}

console.log(`wrote ${outPath} (${codePoints} characters)`);
