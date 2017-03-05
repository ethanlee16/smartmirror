const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res, next) => {
  res.redirect('/mirror.html');
});

app.post('/api/data', (req, res, next) => {
  console.log(req.body);
  res.json({});
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(process.env.PORT);