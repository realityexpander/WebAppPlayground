
// Converts CSS to JS for use in Web Components.
// Usage: node css-to-js.js <input.css> <output directory>
// Example: node css-to-js.js input.css output.js
// Note: Assumes input file is a `.css` file.

// input-filename-with.dots.and-dashes.css:
// .foo {
//   color: red;
// }

// node css-to-js.js input.css output/dir   # <-- outputDir has NO trailing slash.

// <output dir>/input_filename_with_dots_and_dashes.js: <-- note the underscores.
// import { css } from 'lit';
// export default const input_filename_with_dots_and_dashes = css`.foo{color:red;}`;

import fs from 'fs';

var input = process.argv[2];
var outputDir = process.argv[3];

if (!input || !outputDir) {
  console.log('css-to-js.js Usage: node css-to-js.js <input.css> <outputDir>');
  process.exit(1);
}

// Get the extension of the input file.
var inputExtension = input.split('.').pop();
if (inputExtension.toLocaleLowerCase() !== 'css') {
  console.log('css-to-js.js Error: Input file must be a CSS file. input file: ' + input);
  process.exit(1);
}

var outputFileName = input.split('/').pop();
outputFileName = changeSpecialCharsToUnderScores(outputFileName);
var outputFileNameAndExtension = outputFileName + '.js';

var rawCSS = fs.readFileSync(input, 'utf8');
var js = `
  // Generated from css-to-js.js
  // Created on: ${new Date()}
  
  import { css } from 'lit';
  
  export default css\`
  ` +
  rawCSS +
  '\`;';
// export const ${outputFileName} = css\`  // alternative using a const instead of a default export.

fs.writeFileSync(outputDir + '/' + outputFileNameAndExtension, js);

console.log('css-to-js.js Wrote ' + outputDir + '/' + outputFileNameAndExtension);

process.exit(0)


// INTERNAL FUNCTIONS

function changeSpecialCharsToUnderScores(str) {
  return str.replace(/[!@#$%^&*()-.]/g, '_');
}