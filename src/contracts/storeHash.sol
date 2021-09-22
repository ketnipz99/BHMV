pragma solidity 0.5.16;
pragma experimental ABIEncoderV2;

contract storeHash {
	//Upload stored file hash in blockchain

	string public fileHash;
	string public searchWord;
	uint256 public fileCount = 0;
	string[][] public bitmapIndex;

	//Store hash value
	function set(string memory _fileHash) public {

		fileHash = _fileHash;
		//fileHash.push(_fileHash);
		//fileCount += 1;
	}


	//Retrieve hash value
	function get() public view returns (string memory) {

		return fileHash;

		/*
        for (uint i = 0; i < fileCount; i++) {
                return fileHash[i];
            }
        */
	}

	function setBitmapIndex (string[][] memory _bitmapIndex) public {
		bitmapIndex = _bitmapIndex;
	}

	//Try search function
	function searchKeyword (string memory searchToken) public {
		searchWord = searchToken;
	}

	function searchResult () public view returns (string memory) {
		return searchWord;
	}
}
