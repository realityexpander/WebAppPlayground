#!/bin/bash

# Builds the Javascript CSS files for the web components
node ./build-tools/css-to-js.js ./assets/fonts/MaterialIcons-Regular.css ./src/style_scripts
node ./build-tools/css-to-js.js ./styles/material-components-web.min.css ./src/style_scripts
node ./build-tools/css-to-js.js ./node_modules/smart-webcomponents/source/styles/smart.default.css ./src/style_scripts