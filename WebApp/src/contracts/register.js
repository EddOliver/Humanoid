exports.content = () => {
    return `
    // SPDX-License-Identifier: MIT

    pragma solidity >=0.8.0 <0.9.0;
    
    contract HumanoidRegister {
        struct ReverseRegister {
            address cont;
            address account;
        }
    
        mapping(address => ReverseRegister[]) public Registers;
    
        constructor() {}
    
        function addRegister(address _cont) public {
            Registers[msg.sender].push(ReverseRegister(_cont, msg.sender));
        }
    }
    `}

exports.abi2 = () => {
    return [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Registers",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "cont",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_cont",
                    "type": "address"
                }
            ],
            "name": "addRegister",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
};