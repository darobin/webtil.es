#!/usr/bin/env node
import { argv } from 'node:process';
import * as esbuild from 'esbuild';

const isWatch = argv[2] === '--watch';
const sources = [
  { from: 'public/demos/experiment/experiment.js', to: 'public/demos/experiment/experiment.min.js' },
  ].map(({ from, to }) => ({
    entryPoints: [from],
    bundle: true,
    outfile: to,
    format: 'esm',
    sourcemap: isWatch,
  }));

if (isWatch) {
  const contexts = await Promise.all(sources.map(src => esbuild.context(src)));
  await Promise.all(contexts.map(ctx => ctx.watch()));
}
else {
  sources.map(src => esbuild.build(src))
}
