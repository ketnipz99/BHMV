const EthCrypto = require("eth-crypto");


var signatureMethods = {

    signSearchToken: function(searchToken) {

        const signerIdentity = EthCrypto.createIdentity();
        const message = EthCrypto.hash.keccak256([
            {type: "string",value: searchToken}
        ]);
        const signature = EthCrypto.sign(signerIdentity.privateKey, message);
        console.log("message: " + message);
        console.log("signature: " + signature);
        console.log("signer public key: " + signerIdentity.address);

        return signature;
    }
}

export default signatureMethods;