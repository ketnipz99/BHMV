import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import '../../package.json';
import Web3 from 'web3';
import storeHash from '../abis/storeHash.json';
import ipfs from './ipfs';
import indexBuilder from './IndexBuilder'
import cryptographicMod from './EncDecMod'
import TokenSigner from './SignECDSA'

var toBuffer = require ('typedarray-to-buffer')
//const arrayToTxtFile = require('array-to-txt-file')
//var fs = require('fs');

const reader = new window.FileReader()

class App extends Component {
	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchain()
	}

	//Read the account, network, SC and hash value
	//SC needs ABI and address
	async loadBlockchain() {

		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		console.log("Eth account: " + accounts)
		this.setState({account: accounts[0]})
		const networkID = await web3.eth.net.getId()
		console.log("Eth network ID: " + networkID)
		const networkData = storeHash.networks[5777]

		if (networkData) {
			//Fetch the smart contract from the address
			const abi = storeHash.abi
			const address = networkData.address
			const contract = new web3.eth.Contract(abi, address)
			this.setState({contract})
			console.log(contract)

			//var fileHashList = []
			/*
			await contract.methods.get().call(function(error, result) {
				
				if(!error) {
				
					for (var i=0; i<result.length; i++) {
						fileHashList.push(result[i].toString());
					}
					
					console.log(result);
				}
			});
			*/

			//var fileHashList = []
			var fileHashList = await contract.methods.get().call()
			console.log(fileHashList)
		} else {
			window.alert('Smart contract not deployed to detected network')
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			account: '',
			buffer: null,
			contract: null,
			fileHash: '',
			fileLink: null,
			searchInput: '',
		};
	}

	//link with web3 for application deployment on blockchain
	async loadWeb3() {

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert('Please use Metamask')
		}
	}

	captureFile = (event) => {
		event.preventDefault()
		console.log('File Logged')

		//Convert the file format to buffer before sending to IPFS
		const file = event.target.files[0]
		//const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)
		reader.onloadend = () => {

			//set the converted format of the file
			this.setState({buffer: Buffer(reader.result)})
			//log the converted format of the file
			console.log(this.state)
		}
	}

	onSubmit = async (event) => {
		event.preventDefault()
		console.log('Submit Clicked')

		var fileHash;
		var fileIndex = [];
		var t0 = performance.now()
		var encFile = cryptographicMod.fileEncryption(this.state.buffer);
		var t1 = performance.now()
		console.log("EHR encryption took " + (t1 - t0) + " milliseconds.")
		console.log(encFile)
		console.log(this.state.buffer)

		fileIndex[0] = [];

		var convEncFile = new Uint8Array([])
		convEncFile = toBuffer(encFile)
		console.log(convEncFile)

		await ipfs.add(convEncFile, (error, result) => {
			console.log('Ipfs result', result)

			fileHash = result[0].hash
			this.setState({fileHash})
			if (error) {
				console.error(error)
				return
			}

			this.state.fileLink = 'https://ipfs.infura.io/ipfs/' + fileHash
			console.log(this.state.fileLink)

			if (this.state.contract) {
				this.state.contract.methods.set(fileHash)
					.send({from: this.state.account}).then((r) => {
					this.setState({fileHash})

					window.alert('File submitted')
				})
			} else {
				console.log('Contract state is empty')
			}

			//extract the keyword and build index (timed)
			var t2 = performance.now()
			fileIndex = indexBuilder.keywordExtractor(this.state.buffer, fileHash)
			var t3 = performance.now()
			console.log("EHR indexing took " + (t3 - t2) + " milliseconds.")
		})

		/*
		var file = fs.createWriteStream('./index.txt');

		arrayToTxtFile(fileIndex, './index.txt', err => {
			if(err) {
				console.error(err)
				return
			}
			console.log('Successfully wrote to txt file')
		})
		*/


		/*
		//Uploading the fileIndex to blockchain via smart contract
		if(this.state.contract) {
			this.state.contract.methods.setBitmapIndex(fileIndex)
				.send({from: this.state.account}).then((r) => {
				console.log(r);
			})
		}
		else {
			console.log('Contract state is empty')
		}


		/*
		Testing for file decryption only (passed)
		console.log(
			EncDecMod.fileDecryption(
				'1jyspoTi5vKX3xKG9Kl/snMVKaj7s5iHkqWU2E9lg4bKZnTaoZBIkOkICBcI0KPdVi0Rqp3Pv6wuc0bHeC26Fo/ByOkZDiHVLdgu4zHIEVs/73BjXnwoNhZZM904VBvGYI3eI6Ua8d0icynQJsJEeJqeCccqxiQxkYtYw3u1y0hS8k/SVFH5rI1/y64cq4SlJim1jCj4ExvB4DRdP2VAJUyOA70rkziZgx66VxsnIXLBnWSgC8i9LxBrWaySyIZABlKhjo9qLeKgJMkAMeuzPwbRps3JexXV46fPe/bajzbeq0VSY/42RR3AYX1Denzm57PqZkOTgzhG7C/EsI/7+emXMQ6Ze8fMEBUYtg48Fquzz+fe7HZqi2ENmKF0qnUOgmY4hyyUVooG5tbChWEQNfKWuuhubv1dWuIDBv/VGaJFVEXAKCU3LazKr0GjWG5h7yBWo2rNQURzqijhoAk1NXnw1Kt6IREyPhzB//PFTJMSnC8KjIYyibLP+bNxm3MHBPESapnmR7HnIyrOkm2SW3LczKzLLELGoA9Kakxb5s/G01kPeoFFGcD6Z5JW/Bp/FuBWqgS/uTDeBrDADqjZeBnwHEkCKW538C9aMBinAY0gRsLxoxFopHkeynQhSjBb13eG/dBWdu3Oy3FnSLn/aA9OjxL8oLxF4r20GVzOwBTmWH92jdMLWSn22bDpBjR1y6cjRDMN+ph0ZEDp5EURJO7ion+0Viq0CvMQ9sSt1HKJuXfq401ca1pGoBBb4KsIkhxep6+p3VdUlfLn4j94LdnrFmM5EaTDzt0Uhi4yjSGzwYBV9PfQubLHE84uOi3L+xsEqZy49JSGVOO1Qwwko1ZTdGCJkSq+1OQIkG2QmvLpIMR+DyeLjw3tTkZ2eGCixUUzl+O+YWkTM0pBmaoFuVntB9W4EtRcKMRORlWARA/Uq/21eIPaDnLOy/dtNNVxA9V9e5Gy2IQ7ipXRp2OaveEmUrFuGtxkAR7lVIDAVIhvBTArDTcO4KKk9mbiB8szvFckgUYyIVjQXh2J7vIbyg=='))
		 */
	}

	onSearch = async (event) => {
		event.preventDefault()
		console.log(event.target.value)

		this.state.searchInput = event.target.value
	}

	searchSubmit = async (event) => {
		event.preventDefault()
		console.log('Search Clicked', this.state.searchInput)

		let keywordEntered = this.state.searchInput
		console.log(keywordEntered)

		let searchToken = cryptographicMod.searchTokenEnc(keywordEntered);
		console.log(searchToken);
		//sign the searchToken using ECDSA
		let sigSearchToken = TokenSigner.signSearchToken(searchToken);
		console.log(sigSearchToken)


		//upload the search token to smart contract
		//upon submission, the smart contract will call the ecdsa contract to
		//check on the signature validity
		//current issue is gas fee (transaction revert)
		if (this.state.contract) {
			this.state.contract.methods.searchKeyword(searchToken.toString())
				.send({from: this.state.account, gas: 5000000, gasPrice: 20000}, function (err, res) {
					if (err) {
						console.log("Error", err)
						return
					}
					console.log(res)
				})
			/*
                    //call the searchResult function for obtaining search result
                    //change the hyperlink to the result IPFS link
                    var resultFileHash = await contract.searchResult.get().call()
             */
		}

	}


	render() {
		return (
			<div>
				<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 ">
					<h1
						className="navbar-brand col-sm-3 col-md-2 mr-0"
						style={{color: "white"}}>
						BHMV Electronic Healthcare Record System
					</h1>
					<h1 className="navbar-nav px-3">
						<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
							<small className="text-white">
								this.state.account
							</small>
						</li>
					</h1>
				</nav>
				<div style={{justifyContent: 'center', alignItems: 'center'}}>
					<div className="container-fluid mt-5">
						<div className="row">
							<main role="main" className="col-lg-12 d-flex text-center">
								<div className="content mr-auto ml-auto">
									<img src={logo} className="App-logo" alt="logo"
										 width="380"
										 height="380"
										 style={{margin: '2rem 40rem'}}/>

									<h2 style={{marginBottom: '2rem'}}>
										Upload Your Electronic Healthcare Record Here!
									</h2>
									<form onSubmit={this.onSubmit}>
										<input type='file' onChange={this.captureFile}/>
										<input type='SUBMIT'/>
									</form>
									<form
										style={{marginTop: '4rem'}}
										onChange={this.onSearch.bind(this)}>
										<input
											type='search'
											id='searchEHR'
											placeholder='Search your EHR here...'/>
										<button
											type='submit'
											onClick={this.searchSubmit}>
											SEARCH
										</button>
									</form>

									<h1 style={{marginTop: '5rem'}}>
										Search Result:
										<div style={{
											marginTop: '2rem',
											justifyContent: 'center',
											alightItems: 'center'
										}}>
											<a href={this.state.fileLink} download="ehr.txt">
												Download Here
											</a>
										</div>
									</h1>
								</div>
							</main>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default App;
