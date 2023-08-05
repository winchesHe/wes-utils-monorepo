import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  entryPoints: ['src/index.ts'],
  format: ['esm'],
})
