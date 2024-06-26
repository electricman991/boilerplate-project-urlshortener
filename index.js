require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

const postMiddlware = bodyParser.urlencoded({extended: false})
app.use(postMiddlware)
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = {}
app.post('/api/shorturl', (req, res) => {
  const originalurl = req.body.url
  
  try {
  const hostname  = new URL(originalurl).hostname

  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      return res.json({ error: 'invalid url' })
    }
  
    const shortUrl = Object.keys(urls).length + 1
    urls[shortUrl] = originalurl
    res.json({original_url: originalurl, short_url: shortUrl})
  })
  }

  catch {
    res.json({error: 'invalid url'})
  }
})

app.get('/api/shorturl/:url', (req, res) => {
  const shortUrl = req.params.url
  
  // Check if short URL exists in `urls` object
  if (urls.hasOwnProperty(shortUrl)) {
    const originalUrl = urls[shortUrl]
    res.redirect(originalUrl)
  } else {
    res.json({ error: 'Short URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
