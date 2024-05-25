// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FreelanceToken.sol";

contract Escrow {
    address public client;
    address public freelancer;
    address public arbiter;
    FreelanceToken public token;
    uint public amount;
    string public fileUrl;
    bytes32 public fileHash;
    // bytes public fileData;
    // bytes32 public fileDataHash;

    bool public disputeRaised;

    // Rating and Review variables
    uint public clientRating;
    uint public freelancerRating;
    string public clientReview;
    string public freelancerReview;

    uint public submissionDeadline; // Deadline for freelancer to submit work

    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED }
    State public currentState;

    event Deposit(address indexed client, uint amount);
    event WorkSubmitted(address indexed freelancer, string fileUrl);
    event DeliveryConfirmed(address indexed client);
    event FundsReleased(address indexed freelancer, uint amount);
    event RefundIssued(address indexed arbiter, address indexed client, uint amount);

    struct Dispute {
        bool raised;
        string reason;
        string evidence;
        address resolver;
    }
    Dispute public dispute;

    constructor(
        address _client, 
        address _freelancer, 
        address _arbiter, 
        FreelanceToken _token,
        uint _submissionPeriodInDays
    ) {
        client = _client;
        freelancer = _freelancer;
        arbiter = _arbiter;
        token = _token;
        submissionDeadline = block.timestamp + (_submissionPeriodInDays * 1 days); // Set submission deadline
        currentState = State.AWAITING_PAYMENT;
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this function.");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this function.");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter can call this function.");
        _;
    }

    modifier inState(State _state) {
        require(currentState == _state, "Invalid state.");
        _;
    }

    function deposit(uint _amount) external onlyClient inState (State.AWAITING_PAYMENT) {
        require(_amount > 0, "Deposit amount should be greater than zero.");
        amount = _amount;
        token.transferFrom(client, address(this), amount);
        currentState = State.AWAITING_DELIVERY;
        emit Deposit(client, amount);
    }

    function submitWork(string memory _fileUrl) external onlyFreelancer inState(State.AWAITING_DELIVERY) {
        require(block.timestamp <= submissionDeadline, "Submission deadline passed.");
        fileUrl = _fileUrl;
        fileHash = sha256(abi.encodePacked(_fileUrl));
        emit WorkSubmitted(freelancer, _fileUrl);

        // if (_fileData.length > 0) {
        //     fileData = _fileData;
        //     fileDataHash = keccak256(_fileData);
        // } 
        // if (bytes(_fileUrl).length > 0){
        //     fileUrl = _fileUrl;
        //     fileHash = sha256(abi.encodePacked(_fileUrl));
        // }

        emit WorkSubmitted(freelancer, _fileUrl);
    }

    // function confirmDelivery() external onlyClient inState(State.AWAITING_DELIVERY) {
        // if (bytes(fileUrl).length > 0 && fileData.length > 0) {
        //     require(sha256(abi.encodePacked(fileUrl)) == fileHash, "Invalid file URL.");
        //     bytes32 newDataHash = sha256(fileData);
        //     require(newDataHash == fileDataHash, "Invalid file data.");
        // } else if (bytes(fileUrl).length > 0) {
        //     require(sha256(abi.encodePacked(fileUrl)) == fileHash, "Invalid file URL.");
        // } else if (fileData.length > 0) {
        //     bytes32 newDataHash = sha256(fileData);
        //     require(newDataHash == fileDataHash, "Invalid file data.");
        // } else {
        //     revert("No file submitted.");
        // }

    //     if (fileData.length > 0) {
    //         bytes32 newDataHash = keccak256(fileData);
    //         require(newDataHash == fileDataHash, "Invalid file data.");
    //     } else {
    //         revert("No file submitted.");
    //     }

    //     currentState = State.COMPLETE;
    //     releaseFunds();
    //     emit DeliveryConfirmed(client);
    // }

    
    function confirmDelivery() external onlyClient inState(State.AWAITING_DELIVERY) {
        require(keccak256(abi.encodePacked(fileUrl)) != keccak256(abi.encodePacked("")), "File not submitted.");
        currentState = State.COMPLETE;
        releaseFunds();
        emit DeliveryConfirmed(client);
    }

    function releaseFunds() internal {
        require(currentState == State.COMPLETE, "Project not completed yet.");
        token.transfer(freelancer, amount);
        emit FundsReleased(freelancer, amount);
    }

    function getRemainingTime() external view returns (uint) {
        if (block.timestamp >= submissionDeadline) {
            return 0;
        } else {
            return (submissionDeadline - block.timestamp) / (1 days); // Convert remaining time to days
        }
    }

    // function refundClient() external onlyArbiter inState(State.AWAITING_DELIVERY) {
    //     token.transfer(client, amount);
    //     currentState = State.REFUNDED;
    //     emit RefundIssued(arbiter, client, amount);
    // }

    function getFileDetails() external view returns (string memory, bytes32) {
        return (fileUrl, fileHash);
    }

    // Client submits rating and review for the freelancer
    function rateFreelancer(uint _rating, string memory _review) external onlyClient {
        require(currentState == State.COMPLETE || currentState == State.REFUNDED, "Project not completed yet.");
        require(_rating >= 1 && _rating <= 5, "Invalid rating.");
        freelancerRating = _rating;
        freelancerReview = _review;
    }
    
    // Freelancer submits rating and review for the client
    function rateClient(uint _rating, string memory _review) external onlyFreelancer {
        require(currentState == State.COMPLETE || currentState == State.REFUNDED, "Project not completed yet.");
        require(_rating >= 1 && _rating <= 5, "Invalid rating.");
        clientRating = _rating;
        clientReview = _review;
    }
    
    // Get rating and review submitted by the client
    function getClientRating() external view returns (uint, string memory) {
        return (clientRating, clientReview);
    }
    
    // Get rating and review submitted by the freelancer
    function getFreelancerRating() external view returns (uint, string memory) {
        return (freelancerRating, freelancerReview);
    }

    // Client or freelancer raises a dispute
    function raiseDispute(string memory _reason, string memory _evidence) external {
        require(msg.sender == client || msg.sender == freelancer, "Only client or freelancer can raise a dispute.");
        require(currentState == State.AWAITING_DELIVERY , "Dispute can only be raised after work submission.");
        dispute.raised = true;
        dispute.reason = _reason;
        dispute.evidence = _evidence;
        dispute.resolver = address(0); // Reset the resolver address
        disputeRaised = true;
    }
    
    // Arbiter resolves the dispute
    function resolveDispute(bool _isClientCorrect) external onlyArbiter {
        require(disputeRaised, "No dispute raised.");
        require(dispute.resolver == address(0), "Dispute already resolved.");
        if (_isClientCorrect) {
            token.transfer(client, amount);
            currentState = State.REFUNDED;
        } else {
            token.transfer(freelancer, amount);
            currentState = State.COMPLETE;
        }
        dispute.resolver = msg.sender;
        disputeRaised = false;
    }
    
    // Get dispute details
    function getDisputeDetails() external view returns (bool, string memory, string memory, address) {
        return (dispute.raised, dispute.reason, dispute.evidence, dispute.resolver);
    }
}