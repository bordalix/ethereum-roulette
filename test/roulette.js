var Roulette = artifacts.require("Roulette");

contract('Roulette', function(accounts) {
  const oneEther = 1000000000000000000;
  const betAmount = 10000000000000000; // 0.01 ether
  it("get the size of the contract", function() {
    return Roulette.deployed().then(function(instance) {
      var bytecode = instance.constructor._json.bytecode;
      var deployed = instance.constructor._json.deployedBytecode;
      var sizeOfB  = bytecode.length / 2;
      var sizeOfD  = deployed.length / 2;
      console.log("size of bytecode in bytes = ", sizeOfB);
      console.log("size of deployed in bytes = ", sizeOfD);
      console.log("initialisation and constructor code in bytes = ", sizeOfB - sizeOfD);
    });  
  });
  it("betting should increase number of bets", function() {
    let betsCounter;
    let roulette;
    return Roulette.deployed().then(function(instance) {
      roulette = instance;
      return roulette.getStatus.call();
    }).then(function(statusArray) {
      betsCounter = statusArray[0].toNumber();
      return roulette.addEther({value: oneEther, from: accounts[0]});
    }).then(function() {
      return roulette.bet(13, 5, {value: betAmount, from: accounts[0]});
    }).then(function() {
      return roulette.getStatus.call();
    }).then(function(newStatusArray) {
      assert.equal(betsCounter + 1, newStatusArray[0].toNumber());
    })
  });
  it("betting should increase the value of bets", function() {
    let betsValue;
    let roulette;
    return Roulette.deployed().then(function(instance) {
      roulette = instance;
      return roulette.getStatus.call();
    }).then(function(statusArray) {
      betsValue = statusArray[1].toNumber();
      return roulette.addEther({value: oneEther, from: accounts[0]});
    }).then(function() {
      return roulette.bet(13, 5, {value: betAmount, from: accounts[0]});
    }).then(function() {
      return roulette.getStatus.call();
    }).then(function(newStatusArray) {
      assert.equal(betsValue + betAmount, newStatusArray[1].toNumber());
    })
  });
  it("spinning the wheel should reset bets and give winnings", function() {
    let betsValue;
    let roulette;
    return Roulette.deployed().then(function(instance) {
      roulette = instance;
      return roulette.addEther({value: oneEther, from: accounts[0]});
    }).then(function() {
      return roulette.bet(0, 0, {value: betAmount, from: accounts[0]});
    }).then(function() {
      return roulette.bet(1, 0, {value: betAmount, from: accounts[0]});
    }).then(function() {
      return roulette.spinWheel({from: accounts[0]})
    }).then(function() {
      return roulette.getStatus.call();
    }).then(function(statusArray) {
      assert.equal(statusArray[0].toNumber(), 0); // reseted bets length?
      assert.equal(statusArray[1].toNumber(), 0); // reseted bets value?
      assert.equal(statusArray[4].toNumber(), 2 * betAmount); // winnings?
    })
  });
});