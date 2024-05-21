import { defineConfig, s } from 'velite'

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

export default defineConfig({
  root: './src/content',
  collections: {
    changes: {
      name: 'Change', // collection type name
      pattern: 'changelog/**/*.md', // content files glob pattern
      schema: s
        .object({
          title: s.string(),
          date: s.isodate(), // input Date-like string, output ISO Date string.
          content: s.markdown() // transform markdown to html
        })
    },
    abouts: {
      name: 'About', // collection type name
      pattern: 'about/**/*.md', // content files glob pattern
      schema: s
        .object({
          title: s.string(),
          content: s.markdown() // transform markdown to html
        })
    },
  }
})