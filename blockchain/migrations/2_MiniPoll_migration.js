const MiniPoll = artifacts.require("MiniPoll");

module.exports = function (deployer) {
  deployer.deploy(MiniPoll);
};
