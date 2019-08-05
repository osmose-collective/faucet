var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongodb-faucet:27017/osmose_faucet";

module.exports = {
  CheckAddressInDatabase: async function (address) {
    let addressFound = await new Promise(function(resolve, reject) {
      MongoClient.connect(url, {}, function(err, db) {
        if (err)
          throw err;
        
        db.collection("addresses").find({address: address}, {sort: {time: -1}, limit: 1}, function (error, results) {
          if (error) {
            db.close();
            reject(error);
          }

          results.toArray().then(function (value) {
            db.close();
            resolve(value[0]);
          });
        });
      });
    });

    if(!addressFound || addressFound.time.getTime() + 24 * 60 * 60000 < new Date().getTime())
      return true;
    else
      return false;
  },
  AddAddressToDatabase: function (address) {
    MongoClient.connect(url, {}, function(err, db) {
      if (err)
        throw err;
    
      let addressItem = { address: address, time: new Date() };
      db.collection("addresses").insert(addressItem, null, function (error, results) {
        if (error)
          throw error; 
      });
    
      db.close();
    });
  },
  CanSend: async function() {
    let addressFound = await new Promise(function(resolve, reject) {
      MongoClient.connect(url, {}, function(err, db) {
        if (err)
          throw err;
        
        db.collection("addresses").find({}, {sort: {time: -1}, limit: 1}, function (error, results) {
          if (error) {
            db.close();
            reject(error);
          }

          results.toArray().then(function (value) {
            db.close();
            resolve(value[0]);
          });
        });
      });
    });

    if(!addressFound || addressFound.time.getTime() + 30000 < new Date().getTime())
      return true;
    else
      return false;
  }
};