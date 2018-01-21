// Use this package to calculate the hash
// of each block in a blockchain
const SHA256 = require('crypto-js/sha256')
// Set the difficulty (aka number of 0s required
// at the start of the hash of a block for it to be valid)
// The higher the difficulty the longer it will
// take to generate the hash (aka mine)
const difficulty = 4

// Blockchain class includes capabilities to 
// add / get blocks and check validity
class Blockchain {
	// Initialize the Blockchain with a new block
	// and the specified difficulty
	constructor () {
		// Initialize the first block (aka Genesis Block)
		this.chain = [this.createGenesisBlock()]
		// Initialize the difficulty of the blockchain
		this.difficulty = difficulty
	}

	// Function to create initial block
	// of a blockchain
	createGenesisBlock () {
		return new Block(0, new Date(), "Gen Block", "0")
	}

	// Function to get the latest block
	getLatestBlock () {
		return this.chain[this.chain.length - 1]
	}

	// Function to add a block to blockchain
	addBlock (newBlock) {
		// Set the hash of the latest block
		// to be this new block's previous hash
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
	}

	// Function to check the validity of the chain
	isChainValid () {
		// Loop through, starting from second block
		// Since first block is our genesis block
		// and has no hash to previous hash to check against
		for (let i = 1; i < this.chain.length; i++) {
			const currBlock = this.chain[i]
			const prevBlock = this.chain[i - 1]

			// Calculate the hash and check if the hash that is set
			// is actually correct or has been altered
			if (currBlock.hash !== currBlock.calculateHash()) return false
			// Check the previous block's hash so that it
			// equals the previousHash property of the current block
			if (currBlock.previousHash !== previousBlock.hash) return false
		}

		return true
	}
}

// Block class includes capability
// to calculate the hash of a block /
// initializing it and mining the block
class Block {
	// Params: 
	// index in blockchain, 
	// timestamp
	// data
	// hash of previous block
	constructor (index, timestamp, data, previousHash = '') {
		this.index = index
		this.timestamp = timestamp
		this.data = data
		this.previousHash = previousHash
		// This is a value added to hash
		// so that when we mine, we can alter this value
		// to achieve our desired difficulty score
		// (Rest of our block is static data so our hash
		// will return same string, need something to change)
		this.nonce = 0
		this.hash = this.calculateHash()
	}

	// Function to calculate the hash of a block
	calculateHash () {
		return SHA256(this.index +
									this.previousHash +
									this.timestamp +
									JSON.stringify(this.data) +
									this.nonce).toString()
	}

	// Function to re-calculate the hash until desired difficulty is satisfied
	mineBlock (difficulty) {
		// Check if first (x = difficulty) number of digits are 0s
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++
			this.hash = this.calculateHash()
		}
	}
}

let chain = new Blockchain()
console.log('Mining block 1...')
let t0 = new Date().getTime()
chain.addBlock(new Block(1, new Date(), {data:1}))
let t1 = new Date().getTime()
console.log("Call to mine first block took " + (t1 - t0) / 1000 + "seconds.")

console.log('Mining block 2...')
t0 = new Date().getTime()
chain.addBlock(new Block(2, new Date(), {data:2}))
t1 = new Date().getTime()
console.log("Call to mine second block took " + (t1 - t0) / 1000 + "seconds.")

