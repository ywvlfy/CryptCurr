const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
	constructor() {
		this.chain = [Block.genesis()];
	}

	addBlock({ data }) {
		const newBlock = Block.mineBlock({
			lastBlock: this.chain[this.chain.length - 1],
			data
		});

		this.chain.push(newBlock);
	}

	static isValidChain(chain) {
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
			//JSON.stringify() is here because JS does not see data between blocks as equal unless they are under the same instance
			return false;
		}

		for (let i = 1; i < chain.length; i++) {
			const {
				timestamp,
				lastHash,
				hash,
				data,
				nonce,
				difficulty
			} = chain[i];

			const actualLastHash = chain[i - 1].hash;
			const lastDifficulty = chain[i-1].difficulty;

			if (lastHash !== actualLastHash) {
				return false;
			}

			const validatedHash = cryptoHash(
				timestamp,
				lastHash,
				data,
				nonce,
				difficulty
			); //generated a hash from the *potentially* tampered data, timestamp or lastHash

			if (hash !== validatedHash) {
				//if block hash is not equal to hash generated from data, timestamp, lastHash in block...
				return false;
			}

			if(Math.abs((lastDifficulty - difficulty) > 1)) return false;
		}

		return true;
	}

	replaceChain(chain) {
		if (chain.length <= this.chain.length) {
			console.error("the incoming chain must be longer");
			return;
		}

		if (!Blockchain.isValidChain(chain)) {
			console.error("the incoming chain must be valid");
			return;
		}
		console.log("replacing chain with...", chain);

		this.chain = chain;
	}
}

module.exports = Blockchain;
