const { ethers, hre, network } = require('hardhat');

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether');
}

async function main () {

    // setup accounts
    // const [client, freelancer, arbiter] = await ethers.getSigners();
    const [deployer] = await ethers.getSigners();

    const FreelanceToken = await ethers.getContractFactory("FreelanceToken");
    console.log('Deploying FreelanceToken contract...')
    const freelanceToken = await FreelanceToken.deploy();
    const freelanceTokenAddress = await freelanceToken.getAddress();
    console.log('FreelanceToken Deployed to : ', freelanceTokenAddress);
            
    // await freelanceToken.mint(deployer.address, tokens(1000));
    
    // const Escrow = await ethers.getContractFactory("Escrow");
    // console.log('Deploying Escrow contract...')
    // const escrow = await Escrow.deploy(client.address, freelancer.address, arbiter.address, freelanceTokenAddress, 100);
    // console.log('Escrow Deployed to : ', await escrow.getAddress());

    console.log("-------------------------------------------------------------------");
       
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });