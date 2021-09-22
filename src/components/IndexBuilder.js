import cryptographicMod from './EncDecMod'
const keyword_extractor = require("keyword-extractor");

var bitmapIndex = [];
var keyword = [];
var n = 1;
var m = 1;
bitmapIndex[0] = [];

var indexMethods = {

    keywordExtractor: function(abFile, columnHash) {

        //bitmapIndex[0] = [];
        bitmapIndex[0][n] = columnHash;

        //fill the empty array with 0
        for(var j = 1; j < m; j++) {
            bitmapIndex[j][n] = "0";
        }

        //var abToStr = String.fromCharCode.apply(null, new Uint16Array(abFile))

        var abToStr = new TextDecoder().decode(abFile);

        keyword =
            keyword_extractor.extract(abToStr,{
                language: "english",
                remove_digits: true,
                remove_duplicates: true,
                return_changed_case: true,
                return_chained_words: false
            })

        for (let i = m; i < m + keyword.length; i++) {

            var encKeyword = cryptographicMod.keywordEncryption(keyword[i]);

            bitmapIndex[i] = [];
            bitmapIndex[i][0] = encKeyword;
            bitmapIndex[i][n] = "1";
        }


        //fill null array with 0
        for (let x = 0; x < bitmapIndex.length; x++) {
            var innerArrLength = bitmapIndex[x].length;
            for (let y = 0; y < innerArrLength; y++) {
                if (bitmapIndex[x][y] == null) {
                    bitmapIndex[x][y] = "0";
                }
            }
        }

        console.table(bitmapIndex)
        m = bitmapIndex.length;
        n += 1;
        return bitmapIndex;
    }
}

export default indexMethods;