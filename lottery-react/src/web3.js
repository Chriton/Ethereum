import Web3 from 'web3';

// This is needed to allow this application to interact with metamask
window.ethereum.enable();

const web3 = new Web3(window.web3.currentProvider);

export default web3;