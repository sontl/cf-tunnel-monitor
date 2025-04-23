const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Endpoint to open a URL in a browser
app.post('/open-url', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    // Launch a browser
    const browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Open a new page
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Keep the browser open for a while to allow the page to load
    setTimeout(async () => {
      await browser.close();
    }, 10000); // Close after 10 seconds
    
    res.json({ success: true, message: 'URL opened successfully' });
  } catch (error) {
    console.error('Error opening URL:', error);
    res.status(500).json({ error: 'Failed to open URL', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 