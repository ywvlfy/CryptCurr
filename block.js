const hex = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");


class Block {
	constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty;
	}

	static genesis() {
		return new this(GENESIS_DATA);
	}

	static mineBlock({ lastBlock, data }) {
		let hash, timestamp;
		// const timestamp = Date.now();
		const lastHash = lastBlock.hash;
		let { difficulty } = lastBlock;
		let nonce = 0; //set with let so that it can changing dynamically with mining

		/*creating logic for the `mining` aspect of the blockchain*/
		do {
			nonce++;
			timestamp = Date.now();
			hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
			difficulty = this.adjustDifficulty({originalBlock: lastBlock, timestamp});  //adjusts difficulty based on how long it will take to get to the valid hash for each mined block
		} while (hex(hash).substring(0, difficulty) !== "0".repeat(difficulty));

		return new this({
			timestamp, //stamps a date for when the block is mined
			lastHash, //links the new block with the last block in the chain
			data, //data that is stored in the block
			difficulty,
			nonce,
			hash //asymmetrically encrypts the `address` for the block
		});
	}

	static adjustDifficulty({ originalBlock, timestamp }) {
		const { difficulty } = originalBlock;

		const difference = timestamp - originalBlock.timestamp;

		if (difficulty < 1) return 1;

		if (difference > MINE_RATE) return difficulty -1;

		return difficulty + 1;
	}
}

module.exports = Block; //so that node.js can share content between files
