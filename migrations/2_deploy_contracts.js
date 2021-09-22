const storeHash = artifacts.require("storeHash");

module.exports = function(deployer) {
  deployer.deploy(storeHash);
};
