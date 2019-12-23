# pdf-table

pdf-table helps you to generate PDF documents with table from any NodeJS server. We use [PDF Kit](https://github.com/foliojs/pdfkit) under the hood.

## Installation
`yarn add pdf-table` or `npm install --save pdf-table`

## Usage
```
const pdfTable = require('pdf-table');
module.exports = (req, res) => {
    ...
    pdfTable({
    heading: 'Hello World!',
    columnHeaders: ['Sl. No', 'Name'],
    rows: [[1, 'Jane Doe'], [2, 'John Doe']],
    pdfName: 'Names',
    footer: 'This is a sample doc',
    res
  });
}
```
You need to pass a `res` parameter to the config. This is your HTTP response object. pdf-table will attach the generated PDF file to this `res` object.
