import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'e51h9h',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})

// export default {
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// };
//