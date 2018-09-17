var arkjs = require("arkjs");
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  CheckAddress: function (address) {
    return arkjs.crypto.validateAddress(address, 115);
  },
  SendOSM: function (address) {
    let wallet = JSON.parse(fs.readFileSync('config.json', 'utf8')).faucetWallet;
    let nethash = "fa976091894eee4cad258bdae4e3323d0768c4f8610e471237408ac4aa0a92d0";
    let sender = arkjs.crypto.getKeys(wallet);
    let amountSatoshi = 1000 * Math.pow(10, 8);

    let transaction = arkjs.transaction.createTransaction(address, amountSatoshi, "Courtesy of our faucet", sender, undefined, 115);

    let transactions = {
      transactions: [transaction]
    }

    let http = new XMLHttpRequest();
    let url = 'http://blockchain.osmose.world:4100/peer/transactions';
    http.open('POST', url, true);
    http.setRequestHeader("nethash", nethash);
    http.setRequestHeader("version", "1.6.0");
    http.setRequestHeader("port", "1");
    
    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json");
    
    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
          console.log(new Date() + " | 1000 OSM sent from : " + arkjs.crypto.getAddress(sender.publicKey, 115) + " --> " + address);
      }
    };

    http.send(JSON.stringify(transactions));
  }
};