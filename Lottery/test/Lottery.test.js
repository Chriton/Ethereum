const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();

// Web3 is a constructor
const Web3 = require('web3');
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    // Get a list of all the accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0], gas: '1000000',
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0], gas: '1000000',
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1], gas: '1000000',
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2], gas: '1000000',
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () =>  {
        try {
            await lottery.methods.enter().send({
                from: accounts[0], gas: '1000000',
                value: web3.utils.toWei('0.002', 'ether')
                });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                // accounts[0] is the one that deployed the contract. See beforeEach
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async () => {

    // Enter accounts[1] into the lottery with 2 ether
    await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('2', 'ether') });

    // Get the initial balance of accounts[1]
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    //console.log("Initial Balance = " + initialBalance);

    // Optional - get the balance of the contract (how much ether is the prize)
    const initialContractBalance = await web3.eth.getBalance(lottery.options.address);
    //console.log("Initial Contract Balance = " + initialContractBalance);

    // Let the manager (which is accounts[0] See beforeEach) pick a winner.
    // The winner will be the only player that entered -> accounts[1]
    await lottery.methods.pickWinner().send({ from: accounts[0] });

    // Get the final balance of accounts[1]
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    //console.log("Final Balance = " + finalBalance);

    // Assert that accounts[1] has received the ether
    // The difference will not be exactly 2 ether because of the gas price we pay for the transaction
    const difference = finalBalance - initialBalance;
    //console.log("Difference = " + difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'));

    // Assert that after the lottery, the players array will be empty
    const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
    assert.equal(0, players.length);

    // Assert that after the lottery the prize is 0 again
    const finalContractBalance = await web3.eth.getBalance(lottery.options.address);
    //console.log("Final Contract Balance = " + finalContractBalance);
    assert.equal(0, finalContractBalance);
    });
});

