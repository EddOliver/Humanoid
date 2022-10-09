// SPDX-License-Identifier: MIT

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

pragma solidity >=0.8.0 <0.9.0;

contract HumanoidWallet {
    address public Owner;
    address public PubKeyRecover1;
    address public PubKeyRecover2;
    bool public recover1 = false;
    bool public recover2 = false;
    string EcryptedFinger;
    string EcryptedFace;
    string EcryptedPass;
    string EcryptedPubKeyRecover1;
    string EcryptedPubKeyRecover2;

    modifier isPubKeyRecover1() {
        require(msg.sender == PubKeyRecover1);
        _;
    }

    modifier isPubKeyRecover2() {
        require(msg.sender == PubKeyRecover2);
        _;
    }

    modifier isOwner() {
        require(msg.sender == Owner);
        _;
    }

    constructor(
        address _PubKeyRecover1,
        address _PubKeyRecover2,
        string memory _EcryptedFinger,
        string memory _EcryptedFace,
        string memory _EcryptedPass
    ) payable {
        Owner = msg.sender;
        PubKeyRecover1 = _PubKeyRecover1;
        PubKeyRecover2 = _PubKeyRecover2;
        EcryptedFinger = _EcryptedFinger;
        EcryptedFace = _EcryptedFace;
        EcryptedPass = _EcryptedPass;
    }

    // Wallet Natives

    // Wallet Natives - Native Token Transfer

    function transferNative(uint256 value, address payable to) public payable isOwner {
        require(address(this).balance >= value);
        to.transfer(value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalanceECR20(address s_contract) public view returns (uint256) {
        ERC20 ERC20Contract = ERC20(s_contract);
        return ERC20Contract.balanceOf(address(this));
    }

    function transferECR20(
        uint256 value,
        address to,
        address s_contract
    ) public isOwner {
        ERC20 ERC20Contract = ERC20(s_contract);
        require(ERC20Contract.balanceOf(address(this)) >= value);
        ERC20Contract.transfer( to, value);
    }

    function transferECR721(
        address to,
        address s_contract
    ) public isOwner {
        ERC721 ERC721Contract = ERC721(s_contract);
        ERC721Contract.transferFrom(address(this), to, 0);
    }
    
    // Owner

    // Owner - Recover

    function getEcryptedFinger() public view isOwner returns (string memory) {
        return EcryptedFinger;
    }

    function getEcryptedFace() public view isOwner returns (string memory) {
        return EcryptedFace;
    }

    function getEcryptedPass() public view isOwner returns (string memory) {
        return EcryptedPass;
    }

    // Owner - Upgrade

    function upgradePrivsOwner(
        address _newOwner,
        string memory _EcryptedFinger,
        string memory _EcryptedFace,
        string memory _EcryptedPass
    ) public isOwner {
        Owner = _newOwner;
        EcryptedFinger = _EcryptedFinger;
        EcryptedFace = _EcryptedFace;
        EcryptedPass = _EcryptedPass;
    }

    // Social

    // Social - Recover Flags

    function recover1Flag() public isPubKeyRecover1 {
        recover1 = !recover1;
    }

    function recover2Flag() public isPubKeyRecover2 {
        recover2 = !recover2;
    }

    // Social - Upgrade Privs

    function upgradePrivsSocial(
        address _newOwner,
        string memory _EcryptedFinger,
        string memory _EcryptedFace,
        string memory _EcryptedPass
    ) public {
        require(recover1);
        require(recover2);
        Owner = _newOwner;
        EcryptedFinger = _EcryptedFinger;
        EcryptedFace = _EcryptedFace;
        EcryptedPass = _EcryptedPass;
    }

    // Transfer money in the contract ONLY FOR TESTING

    function garbage() public payable isOwner {
        payable(Owner).transfer(address(this).balance);
    }

    receive() external payable {} // Recieve Payments

    fallback() external payable{} // Recieve Payments if recieve doesn't work
}