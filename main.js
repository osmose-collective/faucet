var express = require('express');
var bodyParser = require('body-parser');
var osmose = require('./lib/osmose');
var dbclient = require('./lib/dbclient');

var app = express();
app.use(express.static('public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.get('/', function(req, res) {
  let param = {
    formData: {
      addressError: false,
      delayError: false,
      delayAddressError: false,
      success: false
    }
  };

  res.render('index.ejs', param);
});

app.post('/', async function(req, res) {
  let address = req.body.address;
  let param = {
    formData: {
      addressError: !osmose.CheckAddress(address),
      delayError: false,
      delayAddressError: false,
      success: false
    }
  };

  if(!param.formData.addressError) {
    if(await dbclient.CheckAddressInDatabase(address)) {
      if(await dbclient.CanSend()) {
        osmose.SendOSM(address);
        dbclient.AddAddressToDatabase(address);
        param.formData.success = true;
      }
      else {
        param.formData.delayError = true;
      }
    }
    else
      param.formData.delayAddressError = true;
  }

  res.render('index.ejs', param);
});

app.listen(8080);
