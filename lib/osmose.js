var ark = require('@arkecosystem/crypto');
var ArkClient = require('@arkecosystem/client/lib');
var fs = require('fs');
const configManager = require('@arkecosystem/crypto/lib/managers/config')
const network = require('../network.json')

module.exports = {
  CheckAddress: function (address) {
    return ark.crypto.validateAddress(address, 115);
  },
  SendOSM: function (address) {
    let wallet = JSON.parse(fs.readFileSync('config.json', 'utf8')).faucetWallet;
    let sender = ark.crypto.getKeys(wallet);
    let amountSatoshi = 1000 * Math.pow(10, 8);

    // Setup config manager to osmose network
    configManager.setConfig(network);

    // Generate and sign transaction object
    const transaction = ark.transactionBuilder.transfer()
    .amount(amountSatoshi)
    .vendorField('Courtesy of our faucet')
    .recipientId(address)
    .senderPublicKey(sender.publicKey)
    .sign(wallet)
    .getStruct()

    // Instantiate http client
    let OSMclient = new ArkClient('http://v2.blockchain.osmose.world:4003', 2);

    // Send transaction to osm network
    OSMclient.resource('transactions').create({ transactions: [transaction] })
  }
};