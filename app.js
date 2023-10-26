const fs = require('fs');
const pdf = require('pdf-parse');
const copyPaste = require('copy-paste');

if (process.argv.length < 3) {
  console.log("Usage: node pdf2text.js <file_path>");
  process.exit(1);
}

const dataBuffer = fs.readFileSync(process.argv[2]);

const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

extractTextFromPDF(dataBuffer)
  .then((text) => {
    if (text) {
      copyPaste.copy(text, () => {
        console.log(text);
      });
    } else {
      console.log('Failed to extract text from the PDF.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });