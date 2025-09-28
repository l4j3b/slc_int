# Solace Candidate Assignment

## Preface

There is a lot of room for improvement in this project but not enough time to address all of them.

I focused on completing the 3 tasks that were listed and made 3 PRs

1. Fix any glaring bugs and anti patterns.
2. Improve the design UI/UX to make the experience better for prospective patients. We value design heavily at Solace so feel free to flex your skills in this area. The repo is set up with tailwind but feel free to use any styling framework you’d like.
3. Consider both frontend and backend performance improvements. Assume we have a database of hundreds of thousands of advocates we need to search through.

## What I think should be improved/done

### Miscellaneous

- Update deps (Next 15 & React 19).
- Use pnpm instead of npm.
- Missing next-env.d.ts file.
- .eslintrc.json is missing 'next/typescript' config.
- Add .vscode folder with properly configured settings.json and recommended extensions.
- Add .editorconfig.
- Add .npmrc with engine-strict.
- Add lint-staged/husky.
- Add AI rules.
- Setup testing framework (jest, vitest, etc.).
- Add engines.node to package.json and .nvmrc.
- Remove the .env file, add it to the .gitignore. and add a .env.example file.

### Database scripts/seeding

- Remove the seed route. It is not a good pattern and could be dangerous.
- Move the seed script to the root level folder in a scripts folder.
- Properly configure drizzle.
- Schema: extract specialties in their own table.
- Add some indexes to improve performance.

## Architecture

- Add something like tRPC to get typesafety across the app without having to manually type everything.
- Implement something like tanstack react query to manage the data fetching and caching.
- Creates services to abstract the database queries and other logic.
- Abstract the logic of the advocates list in a hook or so.
- Add a global error boundary to the app.

## UI/UX

- Make the app responsive and mobile friendly.
- I would have liked to have the table height be the height of the remaining space in the page and the content to scroll inside the table. That way the pagination would be at the bottom of the page and always visible.
- I would have liked to have the search and table header to be sticky/always visible.
- It would be nice to add some sorting to the table.
