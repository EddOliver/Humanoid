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
