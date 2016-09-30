var express = require("express");
var app = express();
var port = process.env.PORT || 7500;
var bodyParser = require("body-parser");
var request = require("request");
var rp = require("request-promise")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/search", function(req, res) {
  var options = {
    method: 'GET',
    uri: `http://api.wunderground.com/api/1ffd52bb09ce0d52/forecast/q/${req.body.state}/${req.body.city}.json`,
    resolveWithFullResponse: true,
    json: true
  };
  rp(options)
  .then(function (forecastToday) {
    var today = forecastToday.body.forecast.simpleforecast.forecastday[0];
    var options = {
      method: 'GET',
      uri: `http://api.wunderground.com/api/1ffd52bb09ce0d52/yesterday/q/${req.body.state}/${req.body.city}.json`,
      resolveWithFullResponse: true,
      json: true
    };
    rp(options)
    .then(function (forecastYesterday) {
      var yesterday = forecastYesterday.body.history.dailysummary;
      res.json({today: today, yesterday: yesterday})
    })
  })
})

  app.listen(port)
