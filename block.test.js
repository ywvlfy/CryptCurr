const hex = require('hex-to-binary');
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");


describe("Block", () => {
	const timestamp = 2000;
	const lastHash = "foo-hash";
	const hash = "bar-hash";
	const data = ["blockchain", "data"];
	const nonce = 1;
	const difficulty = 1;
	const block = new Block({
		timestamp,
		lastHash,
		hash,
		data,
		nonce,
		difficulty
	});

	it("has a timestamp, lastHash, hash and data property", () => {
		/*checks that each block instance has all 4 required properties*/
		expect(block.timestamp).toEqual(timestamp);
		expect(block.lastHash).toEqual(lastHash);
		expect(block.hash).toEqual(hash);
		expect(block.data).toEqual(data);
		expect(block.nonce).toEqual(nonce);
		expect(block.difficulty).toEqual(difficulty);
	});

	describe("genesis()", () => {
		const genesisBlock = Block.genesis(); //creates genesis block instance of the Block class

		it("returns a block instance", () => {
			expect(genesisBlock instanceof Block).toBe(true); //returns boolean value depending on whether the first part of the statement is a type of the second part of the statement
		});

		it("returns the genesis data", () => {
			expect(genesisBlock).toEqual(GENESIS_DATA); //this logic works because classes in JS are objects "under the hood"
		});
	});

	describe("mineBlock()", () => {
		const lastBlock = Block.genesis();
		const data = "mined data";
		const minedBlock = Block.mineBlock({ lastBlock, data });

		it("returns a Block instance", () => {
			expect(minedBlock instanceof Block).toBe(true);
		});

		it("sets the `lastHash` to be the `hash` of the lastBlock", () => {
			expect(minedBlock.lastHash).toEqual(lastBlock.hash);
		});

		it("sets the `data`", () => {
			expect(minedBlock.data).toEqual(data);
		});

		it("sets a `timestamp`", () => {
			expect(minedBlock.timestamp).not.toEqual(undefined);
		});

		it("creates a SHA-256 `hash` based on the proper inputs", () => {
			expect(minedBlock.hash).toEqual(
				cryptoHash(
					minedBlock.timestamp,
					minedBlock.nonce,
					minedBlock.difficulty,
					lastBlock.hash,
					data
				)
			);
		});
		it("sets a `hash` that matches the difficulty criteria", () => {
			expect(hex(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual(
				"0".repeat(minedBlock.difficulty)
			);
		});

		it('adjusts the difficulty', () => {
			const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty -1];

			expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
		})
	});

	describe("adjustDifficulty()", () => {
		it("raises the difficulty for a quickly mined block", () => {
			expect(
				Block.adjustDifficulty({
					originalBlock: block,
					timestamp: block.timestamp + MINE_RATE - 100
				})
			).toEqual(block.difficulty + 1);
		});

		it("lowers the difficulty for a quickly mined block", () => {
			expect(
				Block.adjustDifficulty({
					originalBlock: block,
					timestamp: block.timestamp + MINE_RATE + 100
				})
			).toEqual(block.difficulty - 1);
		});

		it('has a lower limit of 1', () => {
			block.difficulty = -1;
			expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1); //checking that difficulty is equal to 1 at the very lowest (1 = LOWER LIMIT)
		})
	});
});
