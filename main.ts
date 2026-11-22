// World News in One Image — Sunday, 22 November 2026 (news-image-20261122).
//
// The entry is a single broadsheet image, entry.png, shipped beside this
// file: 1024x1024, a 64-colour PNG of 35 verified news stories from
// 22 November 2026, drawn as HTML/CSS/SVG and rendered in Chromium.
// This program's only job is to place those exact bytes at
// /output/entry.png, so the judge sees the image unchanged.
//
// It runs with no network, on Node 22, standard library only. Outside the
// grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The image shipped in this repository, beside this program.
const source = fileURLToPath(new URL('./entry.png', import.meta.url));

// The grader gives us /output; locally MAKEFUN_OUTPUT_DIR overrides it.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(source, target);

// Confirm what landed: same size as the shipped file, the same PNG
// magic bytes, and the same full contents, so a truncated or partial copy
// would be noticed instead of silently graded. A pure copy is
// deterministic by construction, so the grader's two runs write
// identical bytes.
const shipped = statSync(source).size;
const written = statSync(target).size;
if (written !== shipped) {
  throw new Error(`entry.png copy incomplete: wrote ${written} of ${shipped} bytes`);
}
const headSource = readFileSync(source).subarray(0, 8);
const headTarget = readFileSync(target).subarray(0, 8);
if (!headSource.equals(headTarget)) {
  throw new Error('entry.png copy mismatch: leading bytes differ from the shipped image');
}
const bodySource = readFileSync(source);
const bodyTarget = readFileSync(target);
if (!bodySource.equals(bodyTarget)) {
  throw new Error('entry.png copy mismatch: contents differ from the shipped image');
}
console.log(`wrote ${target} (${written} bytes)`);
