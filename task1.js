const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create URL schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

app.use(express.json());

// Endpoint to shorten a URL
app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  // Check if the URL is valid
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if the URL already exists in the database
  const existingUrl = await Url.findOne({ originalUrl });
  if (existingUrl) {
    return res.json({ shortUrl: existingUrl.shortUrl });
  }

  // Generate a short ID
  const shortUrl = shortid.generate();
  const newUrl = new Url({ originalUrl, shortUrl });

  // Save the new URL to the database
  await newUrl.save();

  res.json({ shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  // Find the original URL by short URL
  const url = await Url.findOne({ shortUrl });

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

// Validate URL function
function isValidUrl(url) {
  // Use a regex or any library to validate the URL
  return true; // For simplicity, assuming all URLs are valid
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
