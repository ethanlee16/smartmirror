const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const app = express();

const oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_TOKEN,
  token_secret: process.env.TWITTER_TOKEN_SECRET,
  transport_method: 'query'
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.redirect('/mirror.html');
});

app.post('/api/data', (req, res, next) => {
  const lat = req.body.latitude;
  const long = req.body.longitude;
  const results = {};
  request(`https://api.darksky.net/forecast/` 
  + `${process.env.DARKSKY_KEY}/${lat},${long}`, {
    json: true
  })
  .then((response) => {
    results.weather = response.currently;
    return request(`https://api.twitter.com/1.1/search/tweets.json?q=Teen%20Tech%20Week`,
      { oauth, json: true });
    return Promise.resolve(true);
  })
  .then((response) => {
    results.twitter = response.statuses;
  })
  .then(() => {
    console.log(results);
    res.json(results);
  })
  .catch(err => next(err));
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(process.env.PORT, process.env.IP);