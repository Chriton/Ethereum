const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// first smart contract 0xeadafa6fcd476fdff8f36f3e0151bcd6876e3364

const provider = new HDWalletProvider(
  // random test account
  'tone awake sniff layer minor moral blood museum misery quick upset nut',
  'https://rinkeby.infura.io/v3/c10af4d6d6494f78a76664959d68d6d8'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode,
      arguments: ['Hi there!']
    })
    .send({
      gas: '1000000',
      from: accounts[0]
    });
    console.log('Contract deployed to', result.options.address);
};

deploy();
