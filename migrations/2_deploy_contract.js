const Roulette = artifacts.require('./Roulette.sol')
module.exports = function(deployer) {
  deployer.deploy(Roulette);
}