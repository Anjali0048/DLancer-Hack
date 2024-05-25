import React, { useEffect, useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import DLancerBusiness from "../components/Landing/DLancerBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import { useStateProvider } from "../context/StateContext";

// For Blockchain
import {ethers } from "ethers"
import config from "../config.json"
import FreelanceToken from '../abis/FreelanceToken.json'

function Index() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();
  const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [freelanceTokenContract, setFreelanceTokenContract] = useState(null);
    const [freelanceContractAddress, setFreelanceContractAddress] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);
  
    const [escrowAddress, setEscrowAddress] = useState('');
    const [freelancer, setFreelancer] = useState('');
    const [client, setClient] = useState('');
    const [arbiter, setArbiter] = useState('');
    const [submissionDeadline, setSubmissionDeadline] = useState('');
    const [escrowContract, setEscrowContract] = useState('');
    // const [owner, setOwner] = useState('');
  
    const [balance, setBalance] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
  
  const loadBlockchainData = async () => {
        // setOwner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
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
        setFreelanceContractAddress(freelanceContractAddress)
        console.log("freelanceContractAddress: ", freelanceContractAddress);
  
        setProvider(provider);
        setSigner(signer);
        // console.log("signer: ", signer.address )
  
        setFreelanceTokenContract(freelanceTokenContract);
        setCurrentAddress(address);
        // setClient(address);
        setArbiter('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
        
        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.getAddress(accounts[0]);
            setCurrentAddress(account);
        });
    };
  
    useEffect(() => {
      loadBlockchainData();
  }, []);

  // For Blockchian implementation

  return (
    <div>
      <HeroBanner />
      <Companies />
      <PopularServices />
      <Everything />
      <Services />
      <DLancerBusiness />
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </div>
  );
}

export default Index;
