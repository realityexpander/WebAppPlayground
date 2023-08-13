## Web Components Playground

for use with ktor-web-app-server and node-typescript-json-server

## Current dev setup
- terminal 1
  - `npm run start-dev-watch-rollup`
- terminal 2
  - `npm run start-dev-tsc-wds-1`

#### Serve by ngrok:
Google Auth 
  - Requires OAuth Login
  - `npm run serve-ngrok-oauth`
    - `ngrok http http://localhost:8000 --oauth=google --oauth-allow-email=realityexpander@gmail.com`
  - note: can add up to 5 emails on free plan

Basic Auth
  - Simple Basic-Auth login
  - `npm run serve-ngrok-basicauth`
  - `ngrok http http://localhost:8000 --basic-auth user:password`

### Web Components Resources
  - SMART elements
    - https://www.htmlelements.com/demos/page-templates/admin-template/layouts
  - Simple Router
    - https://github.com/dedego/web-component-router#routemixin
  - HTML Elements Templates (admin)
    - https://www.htmlelements.com/templates/
  - SMART site templates
    - https://www.htmlelements.com/templates/
  - Modern Web - Using Web Components Guide
    - https://modern-web.dev/blog/introducing-modern-web/#modern-web-family
    - https://modern-web.dev/guides/going-buildless/getting-started/
    - https://modern-web.dev/docs/dev-server/overview/
    - github
      - https://github.com/modernweb-dev/example-projects/blob/master/lit-element-ts-esbuild/tsconfig.json
  - LIT Playground
    - https://lit.dev/playground/#sample=examples/full-component
    - Youtube: https://www.youtube.com/@buildWithLit/videos
    - Documentation: 
      - https://lit.dev/tutorials/intro-to-lit/
      - https://lit.dev/docs/components/properties/
      - https://lit.dev/docs/releases/upgrade/#update-packages-and-import-paths
      - https://lit.dev/docs/tools/production/
      - https://lit.dev/docs/v1/components/templates/
  - Material-components material-components-web (MDC)
    - https://github.com/material-components/material-components-web/blob/master/packages/mdc-top-app-bar/README.md
    - https://pub.dev/documentation/mdc_web/latest/mdc_web/MDCDrawer-class.html
  - Vite (more sophisticated rollup)
    - https://vitejs.dev/guide/why.html
  - Parcel
    - https://parceljs.org/features/targets/#package.json%23targets.*.source
  - ES6 Bare Module Imports
    - https://dplatz.de/blog/2019/es6-bare-imports.html
  - 10 Must know CSS tricks
    - https://medium.com/before-semicolon/10-css-tricks-you-need-to-know-about-part-2-df52ee0b2937
  - 25 JavaScript Tricks You Need To Know About (Part 1 & 2) 
    - Github: https://github.com/beforesemicolon/javascript-solutions.git
    - https://medium.com/before-semicolon/25-javascript-code-solutions-utility-tricks-you-need-to-know-about-3023f7ed993e
    - https://medium.com/before-semicolon/25-more-javascript-code-solutions-you-need-to-know-about-6ee344c2da58

  - Vaadin
    - https://studio.webcomponents.dev/edit/bCuQQiNnS6eeVejaBPar/www/index.html?p=website
  
  - 9 Web Components UI Libraries You Should Know in 2021
    - https://blog.bitsrc.io/9-web-component-ui-libraries-you-should-know-in-2019-9d4476c3f103
  - Dark Mode Toggle
    - https://github.com/GoogleChromeLabs/dark-mode-toggle/tree/main/demo

  - Awesome Standalones - A curated list of awesome framework-agnostic standalone web components
    - https://github.com/davatron5000/awesome-standalones

  - ++ Shoelace Components
    -  Great one-offs
    - https://shoelace.style/components/mutation-observer
    - QR Code - https://shoelace.style/components/qr-code
    - Image Comparer - https://shoelace.style/components/image-comparer
    - Color Picker - https://shoelace.style/components/color-picker
    - Skeletons - https://shoelace.style/components/skeleton
    - Dialogs - https://shoelace.style/components/dialog
    - Alerts - https://shoelace.style/components/alert
    - Pulsating Badges - https://shoelace.style/components/badge
    - Carousels - https://shoelace.style/components/carousel
    - Details - https://shoelace.style/components/details
    - Divider - https://shoelace.style/components/divider
    - Drawer - https://shoelace.style/components/drawer
    - Dropdown - https://shoelace.style/components/dropdown
    - Bootstrap Icon - https://shoelace.style/components/icon
    - Progress Bar - https://shoelace.style/components/progress-bar
    - Progress Ring - https://shoelace.style/components/progress-ring
    - Rating - https://shoelace.style/components/rating
    - Select (like menu) - https://shoelace.style/components/select
    - Progress Spinners - https://shoelace.style/components/spinner
    - Split Panels - https://shoelace.style/components/split-panel
    - Switch - https://shoelace.style/components/switch
    - Tab Group - https://shoelace.style/components/tab-group
    - Tags & Pills - https://shoelace.style/components/tag
    - ToolTip - https://shoelace.style/components/tooltip
    - Tree (collapsing outline) - https://shoelace.style/components/tree
    - Animated Image - https://shoelace.style/components/animated-image
    - Animation - https://shoelace.style/components/animation
    - Format Bytes - https://shoelace.style/components/format-bytes
    - Format Date - https://shoelace.style/components/format-date
    - Include External html - https://shoelace.style/components/include

  - HTML with Superpowers
    - https://htmlwithsuperpowers.netlify.app/using/systems.html

  - PatternFly Elements
    - Clipboard Copy - https://patternflyelements.org/components/clipboard-copy/
    - Code Blocks - https://patternflyelements.org/components/code-block/
    - Progress Steps - https://patternflyelements.org/components/progress-stepper/

  - Modules
    - https://adamcoster.com/blog/commonjs-and-esm-importexport-compatibility-examples
    - Nodejs - import stuff from mjs file into js file OR how to use require in mjs file?
      - https://stackoverflow.com/a/65784165/2857200

  - Enhance SSR
    - https://github.com/enhance-dev/enhance-ssr
    - https://enhance.dev/docs/learn/concepts/state/store
### Material Design Development
  - https://m2.material.io/develop/web/supporting/ripple
  - https://m2.material.io/components/snackbars/web#installation

  - mdc.xxx source code
    - https://material-components.github.io/material-components-web-catalog/#/component/snackbar
    - https://github.com/material-components/material-components-web
    - https://github.com/material-components/material-components-web/blob/master/packages/mdc-textfield/component.ts

### Testing
  - Testing Web Components with Cypress and TypeScript
    - https://www.thisdot.co/blog/testing-web-components-with-cypress-and-typescript
  - How to use Cypress to write E2E Tests over a Registration Page
    - https://www.youtube.com/watch?v=CotnbfksSig
  - Cypress Docs
    - https://docs.cypress.io/guides/references/legacy-configuration#cypressjson
    - https://github.com/cypress-io/cypress-component-testing-apps/tree/main/svelte-vite-ts
  - Dashboard
    - https://cloud.cypress.io/projects/e51h9h/runs/10/overview/bea4404c-42a4-4821-970e-f0916ed16bd2?roarHideRunsWithDiffGroupsAndTags=1
  - Writing and organizing Tests
    - https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests

  - https://learn.cypress.io/advanced-cypress-concepts/intercepting-network-requests
  - https://cloud.cypress.io/login  // use github

  - #### run local cypress test
    - `npx cypress run --record --key 3fb68fff-d21a-4abe-817a-ef31d8303087`
### Node Libraries
  - Async - Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. 
    - https://github.com/caolan/async
    - https://www.npmjs.com/package/async
    - https://www.npmjs.com/package/async-es

  - Axios - A better fetch
    - https://www.npmjs.com/package/axios
    - https://axios-http.com/docs/intro

### Animation
  - Animating Custom Charts 2021 - #FrameworkLess - 20 lines code - Native Web Components
    - https://www.youtube.com/watch?v=dhZEBVOjVRU
  - Custom Web Component Behaviours and Events
    - https://www.youtube.com/watch?v=Y3EH4tCS6ig

### Utils
  - ASYNC https://www.npmjs.com/package/async-es

### Browser Data for IndexDB
- https://www.npmjs.com/package/dexie
- https://dexie.org/docs/Download

### Deploy using Docker
- https://codersee.com/easily-deploy-ktor-server-with-docker/#elementor-action%3Aaction%3Dpopup%3Aclose%26settings%3DeyJkb19ub3Rfc2hvd19hZ2FpbiI6InllcyJ9
  

### More documents
- https://betterprogramming.pub/how-to-build-a-web-component-with-lit-elements-d88684a46e56
- DataTables
  - https://m2.material.io/components/data-tables/web#data-tables 
  - https://www.htmlelements.com/demos/table/basic/
- Templates
  - Album template
    - https://www.htmlelements.com/demos/page-templates/album/ 
  - Shop
    - https://www.htmlelements.com/demos/page-templates/cart-checkout/cart/index.htm
  - Smart Grid
    - https://www.htmlelements.com/demos/grid/column-dynamic-template/ 
- Material Design
  - https://m2.material.io/develop/web/guides/importing-js
  
8/9/23
- Material Design Components
  - https://m2.material.io/develop/web/supporting/form-fields
- Radio Buttons
  - https://m2.material.io/components/radio-buttons/web#radio-buttons
- Dialogs
  - https://github.com/material-components/material-components-web/blob/master/packages/mdc-dialog/README.md
- Lists
  - https://material-components.github.io/material-components-web-catalog/#/component/list 
  
- Lion (unstyled components)
  - https://lion-web.netlify.app/components/input-stepper/overview/
- MDC Web Components
  - https://github.com/material-components/material-components-web/tree/master/packages/mdc-dialog
  -  https://material-components.github.io/material-components-web-catalog/#/component/dialog

- Smart Components - Table with Data from Ajax
  - https://www.htmlelements.com/demos/page-templates/admin-template/ajax-data 
- CSS Only floating labels
   - https://codepen.io/kvncnls/pen/MWmJaPw
-  Nice Placeholders
   - https://codepen.io/ainalem/pen/GRqPwoz
- CSS Forms
  - https://freefrontend.com/css-forms/
-  

- store json in element attribute
var my_object ={"Super Hero":["Iron Man", "Super Man"]};
var data_str = encodeURIComponent(JSON.stringify(my_object));
data_str = '%7B%22Super%20Hero%22%3A%5B%22Iron%20Man%22%2C%22Super%20Man%22%5D%7D'
decodeURIComponent(data_str)

<div data-foobar='{"foo":"bar"}'></div>  // automatically convers to Object property in JS

- More guide to web components
  - https://javascript.info/custom-elements

8/10/23
- Interesting effects
- Anitmation channel: https://www.youtube.com/@Hyperplexed/videos
- https://codepen.io/Hyperplexed/pen/zYWvXMM

- Lit playground
- https://lit.dev/playground/#sample=examples/motion-grid
- 