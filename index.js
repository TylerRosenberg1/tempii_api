var express = require("express");
var app = express();
var port = process.env.PORT || 7500;
var bodyParser = require("body-parser");
var request = require("request");
var cors = require("cors");
var rp = require("request-promise")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/search", function(req, res) {
  console.log(req);
  var options = {
    method: 'GET',
    uri: `http://api.wunderground.com/api/1ffd52bb09ce0d52/forecast/q/${req.body.state}/${req.body.city}.json`,
    resolveWithFullResponse: true,
    json: true
  };
  rp(options)
  .then(function (forecastToday) {
    if (!forecastToday) {
    } else {
      var today = forecastToday.body.forecast.simpleforecast.forecastday[0];
      var options = {
        method: 'GET',
        uri: `http://api.wunderground.com/api/1ffd52bb09ce0d52/yesterday/q/${req.body.state}/${req.body.city}.json`,
        resolveWithFullResponse: true,
        json: true
      };
      rp(options)
      .then(function (forecastYesterday) {
        var yesterday = forecastYesterday.body.history.dailysummary[0];
        res.json({today: {high: today.high, low: today.low}, yesterday: {high: yesterday.maxtempi, low: yesterday.mintempi}})
      })
    }
  }).catch(function(error) {
    res.status(200).send({error: "Cannot find that location. Make sure to abbreviate the state :)"})
  })
})

  app.listen(port)
