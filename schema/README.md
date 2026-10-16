# Schemas, version 1

One JSON Schema (draft 2020-12) per entity type, validating the YAML frontmatter of the
corresponding page. `step.json` validates the attribute block on a protocol step. All
schemas allow unknown fields so that a page can carry extra metadata before the schema
catches up; known fields are typed.

`schema_version` is `1` everywhere. A breaking change bumps it and ships a migration in
`tools/migrations/`; the validator keeps accepting old versions it can migrate.

The JSON files are the source and are edited by hand. If they grow repetitive, generate them from one
Python source rather than introducing `$ref` across files.
