const CryptoJS = require("crypto-js");

const passKeyword = CryptoJS.lib.WordArray.random(16);
const passFile = CryptoJS.lib.WordArray.random(16);
const salt = CryptoJS.lib.WordArray.random(16);
const iv = CryptoJS.lib.WordArray.random(16);

const keywordKey = CryptoJS.PBKDF2(passKeyword, salt, {
    keySize: 256 / 32
});

const fileKey = CryptoJS.PBKDF2(passFile, salt, {
    keySize: 256 / 32
})

var cryptoMethods = {

    keywordEncryption: function (keywords) {
        var toEncKeyword = CryptoJS.enc.Utf8.parse(keywords);
        var encryptedKeyword = CryptoJS.AES.encrypt(toEncKeyword, keywordKey, {
            iv: iv, //offset
            mode: CryptoJS.mode.CBC, //encryption mode
            padding: CryptoJS.pad.Pkcs7 //padding mode
        })

        return encryptedKeyword.toString();
    },

    searchTokenEnc: function (searchKey) {
        var toEncSearchToken = CryptoJS.enc.Utf8.parse(searchKey);
        var encryptedToken = CryptoJS.AES.encrypt(toEncSearchToken, keywordKey, {
            iv: iv, //offset
            mode: CryptoJS.mode.CBC, //encryption mode
            padding: CryptoJS.pad.Pkcs7 //padding mode
        })

        return encryptedToken.toString();
    },

    fileEncryption: function (fileBuffer) {

        var toEncFile = CryptoJS.enc.Utf8.parse(fileBuffer);
        var encryptedFile = CryptoJS.AES.encrypt(toEncFile, fileKey, {
            iv: iv, //offset
            mode: CryptoJS.mode.CBC, //encryption mode
            padding: CryptoJS.pad.Pkcs7 //padding mode
        })

        var convEncFile = CryptoJS.enc.Utf8.parse(encryptedFile)
        return cryptoMethods.convertWordArrayToUint8Array(convEncFile);
    },

    //Not yet tested
    fileDecryption: function (fileCipher) {

        var ciphertextStr = CryptoJS.enc.Base64.parse(fileCipher);
        var toDecFile = CryptoJS.enc.Base64.stringify (ciphertextStr);
        var decryptedFile = CryptoJS.AES.decrypt (toDecFile, fileKey, {
            iv: iv, //offset
            mode: CryptoJS.mode.CBC, //encryption mode
            padding: CryptoJS.pad.Pkcs7 //padding mode
        });

        var decryptedFileString = decryptedFile.toString(CryptoJS.enc.Utf8);
        return decryptedFileString.toString();
    },

    convertWordArrayToUint8Array: function (wordArray) {
        var len = wordArray.words.length,
            u8_array = new Uint8Array(len << 2),
            offset = 0, word, i
        ;
        for (i=0; i<len; i++) {
            word = wordArray.words[i];
            u8_array[offset++] = word >> 24;
            u8_array[offset++] = (word >> 16) & 0xff;
            u8_array[offset++] = (word >> 8) & 0xff;
            u8_array[offset++] = word & 0xff;
        }
        return u8_array;
    },
}

export default cryptoMethods;

