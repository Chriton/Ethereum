const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();

// Web3 is a constructor
const Web3 = require('web3');
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!'

beforeEach(async () => {
    // Get a list of all the accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
        arguments: [INITIAL_STRING]
      })
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      //inbox.setProvider(provider);
});


describe('Inbox', () => {
    it('deploys a contract', () => {
        //console.log(accounts);
        //console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
      const message = await inbox.methods.message().call();
      assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
      // TODO - set new message
      await inbox.methods.setMessage('bye')
      .send({
        from: accounts[0],
        gas: '1000000'
      })

      const message = await inbox.methods.message().call();
      assert.equal(message, 'bye');
    });
});
