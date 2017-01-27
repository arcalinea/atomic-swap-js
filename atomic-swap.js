var zcore = require('bitcore-lib-zcash');
var crypto = require('crypto');
// use zcash testnet
var network = zcore.Networks.testnet;

var AtomicSwap = (function(){
  function generateTx1andTx2(network, privkeyWif, recipientPubkeyHex, amount, prevOutputs){
    // A picks random number
    var x = crypto.randomBytes(32)
    console.log("Random: " + x);
    // hash random number
    var xHashHex = crypto.createHmac('sha256', x).digest('hex');
    console.log("Hash of x: ", xHashHex);
    // A creates TX1: "Pay w BTC to <B's public key> if (x for H(x) known and signed by B) or (signed by A & B)"
    // Return an array
    var swapTx = generateSwapTx(privkeyWif, recipientPubkeyHex, amount, prevOutputs, xHashHex);
    var tx1 = swapTx[0];
    var swapScript = swapTx[1];

    // B creates TX4: "Pay v alt-coins from TX3 to <B's public key>, locked 24 hours in the future"
    var tx2 = generateRefundTx(privkeyWif, amount, tx1, swapScript, hours=48);

    var stepOne = {
      "tx1": tx1,
      "swapScript": swapScript,
      // convert x to hex
      "x": x.toString('hex')),
      "tx2": tx2
    };
  };

  function generateSwapTx(privkeyWif, recipientPubkeyHex, amount, prevOutputs, xHashHex){
    // just generating a privkey here?
    var privkey = new zcore.PrivateKey(privkeyWif).toAddress();
    var senderPubkey = privkey.toPublicKey();
    // tx... new?
    var tx = new Transaction();
    // create special swap script (non-standard p2sh)
    var redeemScript = zcore.Script.fromString(`OP_IF` + ` 2 ${senderPubkey} ${recipientPubkeyHex} 2 OP_CHECKMULTISIGVERIFY ` + `OP_ELSE` + ` ${recipientPubkeyHex} OP_CHECKMULTISIGVERIFY OP_HASH256 ${xHashHex} OP_EQUALVERIFY`); // .raw?
    // Create a pay-to-script hash from the redeemScript
    var p2shScript = redeemScript.toScriptHashOut();
    // .....
  };

  function generateRefundTx(privkeyWif, amount, swapTx, swapScript, hours){
    var privkey = new zcore.PrivateKey(privkeyWif).toAddress();
    var refundTx = new Transaction();
    // .... 
  }
}());

// var privateKey = new zcore.PrivateKey();
// console.log("private key" + privateKey);
// var address = privateKey.toAddress();
// console.log("address " + address)
// console.log("network " + network)
//
// var x = crypto.randomBytes(32)
// console.log("Random: " + x);
// console.log(x.toString('hex'));
// // hash random number
// var xHashHex = crypto.createHmac('sha256', x).digest('hex');
// console.log("Hash of x: ", xHashHex);
