const storeHash = artifacts.require("storeHash");

require('chai')
	.use(require('chai-as-promised'))
	.should()
	
contract('storeHash', (accounts) => {
	let hash
	
	before(async () => {
		hash = await storeHash.deployed()	
	})
	
	describe ('deployment', async () => {
		
		it ('deploys successfully', async () => {
			
			const address = hash.address
			//check blockchain add empty or not
			assert.notEqual(address, '')
			assert.notEqual(address, '0x0')
			assert.notEqual(address, 'null')
			assert.notEqual(address, 'undefined')
		
		})
	})
	
	describe('storage', async () => {
		it('updates the fileHash', async () => {
				
			let fileHash = 'abc123'
			await storeHash.set(fileHash)
			const result = await storeHash.get()
			
			assert.equal(result, fileHash)
		})
	})
})