import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);
window.ethereum.enable();

export default web3;
