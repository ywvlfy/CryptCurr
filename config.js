const MINE_RATE = 1000;

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
	// syntax is in all caps ((screen case syntax)), used so that it is obvious that the code is using a *hardcoded global value*
	timestamp: 1,
	lastHash: "---",
	hash: "hash-one",
	data: [],
	difficulty: INITIAL_DIFFICULTY,
	nonce: 0
};

module.exports = { GENESIS_DATA, MINE_RATE };
