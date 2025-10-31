export default {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm typecheck',

  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js|mjs|mts)': () => [`pnpm lint`, `pnpm format`],
};
