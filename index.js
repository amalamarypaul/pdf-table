//Importing pdfKit module as PDFDocument
const PDFDocument = require('pdfkit');

//Set the margin variable for the document
const MARGIN = 50;

//The width in which content will be printed
const PRINTABLE_WIDTH=500;

//The height of each single row in table
const ROW_HEIGHT=30;
const STROKE_LINE_WIDTH=0.1;
const STROKE_LINE_COLOR='#aaaaaa';
const HEADING_COLOR='#444444';
const MARGIN_TOP=100;
const HEADING_MARGIN_TOP=40;
const FOOTER_MARGIN_TOP=780;
const PADDING_TOP=20;
const NORMAL_FONT_SIZE=10;
const HEADING_FONT_SIZE=18;
const TOTAL_ROWS_IN_PAGE=20;


// Function pdfTable defined to denerate pdf doc and attch to res object
//Params accepting
// heading - string, columnHeaders - array of strings
//rows - array of array of strings, pdfName - string, //res - HTTP response, footer - string
const pdfTable =({ heading,columnHeaders,rows,pdfName,res, footer})=>{

  //doc is instance of PDFDocument class,  and initialized with size A4 and with MARGIN
  let doc = new PDFDocument({ size: 'A4', margin: MARGIN });

  //doc is a readable node stream, it is not saving anywhere automatically.
  //So pipe is a method to send the output to writable node stream.
  //Pipe to HTTP response
  doc.pipe(res);

  //Set up the header content type
  res.setHeader('Content-Type', 'application/pdf');

  //Content disposition setting the header to indicating, content is expected to be displayed inline in the browser
  //Filename is accepting as param, if not providing set to output.pdf
  res.setHeader('Content-Disposition', `attachment; filename=${pdfName?pdfName:'output'}.pdf`);

//Check the heading is passed or not, if there set the table heading
  heading && generateTableHeading(doc,heading);

  generateTable(doc, columnHeaders,rows, footer);

  //Finalize the pdf and end the stream
  doc.end();
}

//Function to generate the table based on the data provided.
function generateTable(doc, columnHeaders,rows,footer) {

  // Used to iterate table data
  let i;

  //variable used to keep the margi top value, initialized with 80
  let tableTop = 80;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    tableTop,
    columnHeaders
  );
  horizontalLine(doc, tableTop + PADDING_TOP);
  doc.font('Helvetica');
  footer && generateFooter(doc,footer);

  for (i = 0; i < rows.length; i++) {
    if (i !== 0 && i % TOTAL_ROWS_IN_PAGE === 0) {

      //Breaking into new page
      doc.addPage();
      tableTop = MARGIN_TOP;
      doc.font('Helvetica-Bold');
      generateTableRow(
        doc,
        tableTop,
        columnHeaders
      );
      horizontalLine(doc, tableTop + PADDING_TOP);
      doc.font('Helvetica');
      footer && generateFooter(doc,footer);
    }
    const item = rows[i];
    const position = tableTop + ((i % TOTAL_ROWS_IN_PAGE) + 1) * ROW_HEIGHT;
    generateTableRow(
      doc,
      position,
      item
    );

    horizontalLine(doc, position + PADDING_TOP);
  }
}

//Generate a horizontal line seperating to rows
function horizontalLine(doc, y) {
  doc
    .strokeColor(STROKE_LINE_COLOR)
    .lineWidth(STROKE_LINE_WIDTH)
    .moveTo(MARGIN, y)
    .lineTo(PRINTABLE_WIDTH+50, y)
    .stroke();
}

function generateTableRow(
  doc,
  y,
  items
) {

  //Width of each items split equally
  const columnWidth = PRINTABLE_WIDTH/items.length;

  let x =MARGIN;
  doc
    .fontSize(NORMAL_FONT_SIZE)
    items.forEach(i=>{
      doc.text(i,x,y);
      x=x+columnWidth;
    })
}
function generateTableHeading(doc,heading) {
  doc
    .fillColor(HEADING_COLOR)
    .fontSize(HEADING_FONT_SIZE)
    .text(heading, MARGIN, HEADING_MARGIN_TOP,{ align: 'center'} )
    .moveDown();
}

function generateFooter(doc,footer) {
  doc.fontSize(NORMAL_FONT_SIZE).text(footer, MARGIN, FOOTER_MARGIN_TOP, {
    align: 'center',
    width: PRINTABLE_WIDTH
  });
}
//Export function pdfTable to available anywhere
module.exports=pdfTable;
