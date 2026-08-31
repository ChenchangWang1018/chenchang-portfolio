# Portfolio content architecture

This directory contains data and editorial copy only. It has no UI or routing
responsibilities.

## Language model

English copy lives under `locales/en/`. Simplified Chinese copy lives under
`locales/zh-CN/`. The two locale trees intentionally share types but not prose.
Chinese content should be authored for mainland Chinese recruiting context, not
produced as a literal translation of the English copy.

`null` marks wording that still needs editorial approval. Empty arrays mark
categories for which no verified entries have been supplied.

## Adding content

- Add verified external destinations to `../config/links.ts`.
- Add original source-material paths to `../config/source-assets.ts`.
- Add a project's shared, language-neutral record to `project-catalog.ts`, then
  add independently authored copy under both locale `projects.ts` files.
- Add experience, education, navigation, and skill entries to the matching file
  in each locale directory. Keep stable entry IDs across locales when the two
  entries describe the same underlying item.

Adding content records should not require changes to future layout components.

