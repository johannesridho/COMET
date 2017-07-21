const Promise = require('bluebird')
const CONFIG = require('../config')
const EthUtils = require("../utils/EthUtils.js")
const Web3Singleton = require("../repositories/Web3Singleton.js")
const ContractObject = require("../utils/ContractObject")

const SOL = './contracts/CometContract.sol'
const CONTRACT_NAME = 'CometContract'
const CONTRACT_ADDRESS = '0xdd6ab28f8622f5ac3a680a944b9cde92e131ed45'

const TransactionService = function () {
  
  this.web3Instance = Web3Singleton.getInstance()
  
  this.getTransaction = (txHash) => this.web3Instance.getTransaction(txHash)

  this.transact = (to, from, transactionToken, signature, value) => {
    const rsv = EthUtils.getRSVFromSignature(this.web3Instance.web3, signature)
    const contractObject = new ContractObject(this.web3Instance.web3, CONTRACT_NAME, SOL)
    return contractObject
      .getContractInstanceFromAddress(CONTRACT_ADDRESS)
      .then((contractInstance) => {
        const balanceBefore = contractInstance.getBalance(from)
        contractInstance.transfer(from, to, value, transactionToken, rsv.v, rsv.r, rsv.s)
        const balanceAfter = contractInstance.getBalance(from)
        const payload = {
          'from': from,
          'balance_before': balanceBefore,
          'balance_after': balanceAfter,
        }
        console.log(payload)
        return payload
      })
  }
}

module.exports = new TransactionService()