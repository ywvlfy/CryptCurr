const crypto = require("crypto"); //default cryptography module built into node.js



/*this file handles the asymmetrical encryption of the blockchain*/
/*encrypts everything within the block (timestamp, block, data, lastHash) to a 256 byte hex format*/

const cryptoHash = (...inputs) => {
	const hash = crypto.createHash("sha256");

	hash.update(inputs.sort().join(" "));

	return hash.digest("hex");
};

module.exports = cryptoHash;
