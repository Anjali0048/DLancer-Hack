import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import config from '../config.json';
import FreelanceToken from '../abis/FreelanceToken.json';
import { initialState, reducerBlock } from './StateReducers_Block';

export const StateContext_Block = createContext();

export const StateProviderBlock = ({ children }) => {
  const [state, dispatch] = useReducer(reducerBlock, initialState);

  const loadBlockchainData = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    const freelanceTokenContract = new ethers.Contract(
      config[network.chainId].FreelanceToken.address,
      FreelanceToken,
      signer
    );
    const freelanceContractAddress = await freelanceTokenContract.getAddress();

    dispatch({ type: 'SET_PROVIDER', payload: provider });
    dispatch({ type: 'SET_SIGNER', payload: signer });
    dispatch({ type: 'SET_FREELANCE_TOKEN_CONTRACT', payload: freelanceTokenContract });
    dispatch({ type: 'SET_FREELANCE_CONTRACT_ADDRESS', payload: freelanceContractAddress });
    dispatch({ type: 'SET_CURRENT_ADDRESS', payload: address });
    dispatch({ type: 'SET_ARBITER', payload: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' });

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.getAddress(accounts[0]);
      dispatch({ type: 'SET_CURRENT_ADDRESS', payload: account });
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return <StateContext_Block.Provider value={{ state, dispatch }}>{children}</StateContext_Block.Provider>;
};

export const useStateProviderBlock = () => useContext(StateContext_Block);
