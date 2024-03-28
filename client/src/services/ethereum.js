import { ethers } from 'ethers';

export const getProvider = async () => {
  let provider;
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      console.log(accounts[0].address);
      return provider;
    } catch (error) {
      console.error('User denied account access');
      return null;
    }
  } else {
    console.error('Please install MetaMask!');
    return null;
  }
};
