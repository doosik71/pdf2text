// app.js
const express = require('express');
const pdf = require('pdf-parse');

const app = express();
const port = 3000;
const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 2em;
            }
            #url {
              width: 40em;
            }
          </style>
        <title>PDF2Text</title>
    </head>
    <body>
        <form action="/pdf" method="get">
            <label for="url">PDF URL:</label>
            <input type="url" id="url" name="url" spellcheck="false"placeholder="Input PDF url here!" required>
            <button type="submit">Submit</button>
            <p>PDF example: <a href="pdf?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf">https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf</a></p>
        </form>
    </body>
</html>
`;

// Define a route
app.get('/', (req, res) => {
  res.send(html);
});

// Handle the GET request with query parameters
app.get('/pdf', async (req, res) => {
  const pdfUrl = req.query.url;
  const extractedText = await extractTextFromPdf(pdfUrl);
  res.send(extractedText);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

async function extractTextFromPdf(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const extractedText = await pdf(arrayBuffer);

    return extractedText.text;
  } catch (error) {
    return `[Error] "${error}"`;
  }
}
