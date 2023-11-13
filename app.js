// app.js
const express = require('express');
const pdf = require('pdf-parse');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route
app.get('/', (req, res) => {
  res.render('index');
});

// Handle the GET request with query parameters
app.get('/url', async (req, res) => {
  const pdfUrl = req.query.url;
  const extractedText = await extractTextFromPdf(pdfUrl);
  res.send('<pre>\n' + extractedText + '\n</pre>');
});

// Handle the GET request with query parameters
app.post('/file', upload.single('file'), async (req, res) => {
  try {
    const extractedText = await pdf(req.file.buffer);
    res.send('<pre>\n' + extractedText.text + '\n</pre>');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
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
