const fs = require('fs');
const Connection = require("@arkecosystem/client").Connection;
const Crypto = require("@arkecosystem/crypto").Crypto;
const Managers = require("@arkecosystem/crypto").Managers;
const Transactions = require("@arkecosystem/crypto").Transactions;
const Identities = require("@arkecosystem/crypto").Identities;

// Global var
Managers.configManager.setConfig(
  JSON.parse(fs.readFileSync("networks.json", "utf8"))
  );

const client = new Connection("http://testnet.osmose.world:4003/api/v2");

module.exports = {
  CheckAddress: function (address) {
    return Identities.Address.validate(address, 65);
  },
  SendOSM: async function (address) {
    const walletPassphrase = JSON.parse(fs.readFileSync('config.json', 'utf8')).faucetWallet.normalize('NFD');
    const sender = Identities.Address.fromPublicKey(Identities.Keys.fromPassphrase(walletPassphrase).publicKey, 65);
    const amountoOSMtoshi = 100 * Math.pow(10, 8);

    const data = "Courtesy from OSMOSE Faucet"

    let transaction = Transactions.BuilderFactory
    .transfer()
    .amount(`${amountoOSMtoshi}`)
    .recipientId(address)
    .network(65)
    .vendorField(data)
    .sign(walletPassphrase);

    const {status } = await client.api("transactions").create({ transactions: [transaction.getStruct()] });

    if ( status === 200) {
        console.log(new Date() + " | 100 OSM sent from : " + sender + " --> " + address);
    }
  }
};