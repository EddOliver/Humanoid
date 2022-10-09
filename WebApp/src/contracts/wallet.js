exports.content = () => {
    return `
    // SPDX-License-Identifier: MIT

    import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
    import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
    
    pragma solidity >=0.8.0 <0.9.0;
    
    contract HumanoidWallet {
        address public Owner;
        address public PubKeyRecover1;
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
`}

exports.abi = () => {
    return [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_PubKeyRecover1",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_PubKeyRecover2",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFinger",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFace",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedPass",
                    "type": "string"
                }
            ],
            "stateMutability": "payable",
            "type": "constructor"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [],
            "name": "EcryptedFace",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "EcryptedFinger",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "EcryptedPass",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "Owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "PubKeyRecover1",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "PubKeyRecover2",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "garbage",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "s_contract",
                    "type": "address"
                }
            ],
            "name": "getBalanceECR20",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "recover1",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "recover1Flag",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "recover2",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "recover2Flag",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "s_contract",
                    "type": "address"
                }
            ],
            "name": "transferECR20",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "s_contract",
                    "type": "address"
                }
            ],
            "name": "transferECR721",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "to",
                    "type": "address"
                }
            ],
            "name": "transferNative",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFinger",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFace",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedPass",
                    "type": "string"
                }
            ],
            "name": "upgradePrivsOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFinger",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedFace",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_EcryptedPass",
                    "type": "string"
                }
            ],
            "name": "upgradePrivsSocial",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ]
};

exports.bytecode = () => {
    return ("60806040526000600260146101000a81548160ff0219169083151502179055506000600260156101000a81548160ff02191690831515021790555060405162001a1638038062001a1683398181016040528101906200005f9190620002bc565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600390805190602001906200013992919062000177565b5081600490805190602001906200015292919062000177565b5080600590805190602001906200016b92919062000177565b50505050505062000573565b82805462000185906200046a565b90600052602060002090601f016020900481019282620001a95760008555620001f5565b82601f10620001c457805160ff1916838001178555620001f5565b82800160010185558215620001f5579182015b82811115620001f4578251825591602001919060010190620001d7565b5b50905062000204919062000208565b5090565b5b808211156200022357600081600090555060010162000209565b5090565b60006200023e6200023884620003ca565b620003a1565b9050828152602081018484840111156200025d576200025c62000539565b5b6200026a84828562000434565b509392505050565b600081519050620002838162000559565b92915050565b600082601f830112620002a157620002a062000534565b5b8151620002b384826020860162000227565b91505092915050565b600080600080600060a08688031215620002db57620002da62000543565b5b6000620002eb8882890162000272565b9550506020620002fe8882890162000272565b945050604086015167ffffffffffffffff8111156200032257620003216200053e565b5b620003308882890162000289565b935050606086015167ffffffffffffffff8111156200035457620003536200053e565b5b620003628882890162000289565b925050608086015167ffffffffffffffff8111156200038657620003856200053e565b5b620003948882890162000289565b9150509295509295909350565b6000620003ad620003c0565b9050620003bb8282620004a0565b919050565b6000604051905090565b600067ffffffffffffffff821115620003e857620003e762000505565b5b620003f38262000548565b9050602081019050919050565b60006200040d8262000414565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60005b838110156200045457808201518184015260208101905062000437565b8381111562000464576000848401525b50505050565b600060028204905060018216806200048357607f821691505b602082108114156200049a5762000499620004d6565b5b50919050565b620004ab8262000548565b810181811067ffffffffffffffff82111715620004cd57620004cc62000505565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b620005648162000400565b81146200057057600080fd5b50565b61149380620005836000396000f3fe60806040526004361061010d5760003560e01c80636e7431df11610095578063b4a99a4e11610064578063b4a99a4e14610329578063be249f0514610354578063c3c222801461037f578063f32a67b4146103a8578063fd38b21a146103c457610114565b80636e7431df1461029157806380db727f146102bc57806381d574c5146102e7578063ae84b8041461031257610114565b806333076398116100dc57806333076398146101be5780633b1ada7e146101e757806354b75f2714610212578063557d3c8b1461023d5780635f5855271461025457610114565b8063068fce091461011657806312065fe01461013f57806312a252ad1461016a57806327ed66fd1461019357610114565b3661011457005b005b34801561012257600080fd5b5061013d60048036038101906101389190611060565b6103ce565b005b34801561014b57600080fd5b50610154610554565b60405161016191906111e0565b60405180910390f35b34801561017657600080fd5b50610191600480360381019061018c9190610ecb565b61055c565b005b34801561019f57600080fd5b506101a861062e565b6040516101b591906111be565b60405180910390f35b3480156101ca57600080fd5b506101e560048036038101906101e09190610f0b565b6106bc565b005b3480156101f357600080fd5b506101fc610779565b6040516102099190611128565b60405180910390f35b34801561021e57600080fd5b5061022761079f565b6040516102349190611128565b60405180910390f35b34801561024957600080fd5b506102526107c5565b005b34801561026057600080fd5b5061027b60048036038101906102769190610e9e565b61084b565b60405161028891906111e0565b60405180910390f35b34801561029d57600080fd5b506102a66108e2565b6040516102b391906111be565b60405180910390f35b3480156102c857600080fd5b506102d1610970565b6040516102de91906111a3565b60405180910390f35b3480156102f357600080fd5b506102fc610983565b60405161030991906111be565b60405180910390f35b34801561031e57600080fd5b50610327610a11565b005b34801561033557600080fd5b5061033e610a97565b60405161034b9190611128565b60405180910390f35b34801561036057600080fd5b50610369610abb565b60405161037691906111a3565b60405180910390f35b34801561038b57600080fd5b506103a660048036038101906103a19190610f0b565b610ace565b005b6103c260048036038101906103bd9190611020565b610bb1565b005b6103cc610c61565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461042657600080fd5b6000819050838173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016104659190611128565b60206040518083038186803b15801561047d57600080fd5b505afa158015610491573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b59190610ff3565b10156104c057600080fd5b8073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb84866040518363ffffffff1660e01b81526004016104fb92919061117a565b602060405180830381600087803b15801561051557600080fd5b505af1158015610529573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061054d9190610fc6565b5050505050565b600047905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146105b457600080fd5b60008190508073ffffffffffffffffffffffffffffffffffffffff166323b872dd308560006040518463ffffffff1660e01b81526004016105f793929190611143565b600060405180830381600087803b15801561061157600080fd5b505af1158015610625573d6000803e3d6000fd5b50505050505050565b6003805461063b9061131b565b80601f01602080910402602001604051908101604052809291908181526020018280546106679061131b565b80156106b45780601f10610689576101008083540402835291602001916106b4565b820191906000526020600020905b81548152906001019060200180831161069757829003601f168201915b505050505081565b600260149054906101000a900460ff166106d557600080fd5b600260159054906101000a900460ff166106ee57600080fd5b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260039080519060200190610744929190610d22565b50816004908051906020019061075b929190610d22565b508060059080519060200190610772929190610d22565b5050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461081f57600080fd5b600260159054906101000a900460ff1615600260156101000a81548160ff021916908315150217905550565b6000808290508073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161088a9190611128565b60206040518083038186803b1580156108a257600080fd5b505afa1580156108b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108da9190610ff3565b915050919050565b600580546108ef9061131b565b80601f016020809104026020016040519081016040528092919081815260200182805461091b9061131b565b80156109685780601f1061093d57610100808354040283529160200191610968565b820191906000526020600020905b81548152906001019060200180831161094b57829003601f168201915b505050505081565b600260149054906101000a900460ff1681565b600480546109909061131b565b80601f01602080910402602001604051908101604052809291908181526020018280546109bc9061131b565b8015610a095780601f106109de57610100808354040283529160200191610a09565b820191906000526020600020905b8154815290600101906020018083116109ec57829003601f168201915b505050505081565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a6b57600080fd5b600260149054906101000a900460ff1615600260146101000a81548160ff021916908315150217905550565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260159054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b2657600080fd5b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260039080519060200190610b7c929190610d22565b508160049080519060200190610b93929190610d22565b508060059080519060200190610baa929190610d22565b5050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c0957600080fd5b81471015610c1657600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015610c5c573d6000803e3d6000fd5b505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610cb957600080fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015610d1f573d6000803e3d6000fd5b50565b828054610d2e9061131b565b90600052602060002090601f016020900481019282610d505760008555610d97565b82601f10610d6957805160ff1916838001178555610d97565b82800160010185558215610d97579182015b82811115610d96578251825591602001919060010190610d7b565b5b509050610da49190610da8565b5090565b5b80821115610dc1576000816000905550600101610da9565b5090565b6000610dd8610dd384611220565b6111fb565b905082815260208101848484011115610df457610df36113e1565b5b610dff8482856112d9565b509392505050565b600081359050610e1681611401565b92915050565b600081359050610e2b81611418565b92915050565b600081519050610e408161142f565b92915050565b600082601f830112610e5b57610e5a6113dc565b5b8135610e6b848260208601610dc5565b91505092915050565b600081359050610e8381611446565b92915050565b600081519050610e9881611446565b92915050565b600060208284031215610eb457610eb36113eb565b5b6000610ec284828501610e07565b91505092915050565b60008060408385031215610ee257610ee16113eb565b5b6000610ef085828601610e07565b9250506020610f0185828601610e07565b9150509250929050565b60008060008060808587031215610f2557610f246113eb565b5b6000610f3387828801610e07565b945050602085013567ffffffffffffffff811115610f5457610f536113e6565b5b610f6087828801610e46565b935050604085013567ffffffffffffffff811115610f8157610f806113e6565b5b610f8d87828801610e46565b925050606085013567ffffffffffffffff811115610fae57610fad6113e6565b5b610fba87828801610e46565b91505092959194509250565b600060208284031215610fdc57610fdb6113eb565b5b6000610fea84828501610e31565b91505092915050565b600060208284031215611009576110086113eb565b5b600061101784828501610e89565b91505092915050565b60008060408385031215611037576110366113eb565b5b600061104585828601610e74565b925050602061105685828601610e1c565b9150509250929050565b600080600060608486031215611079576110786113eb565b5b600061108786828701610e74565b935050602061109886828701610e07565b92505060406110a986828701610e07565b9150509250925092565b6110bc8161126d565b82525050565b6110cb81611291565b82525050565b6110da816112c7565b82525050565b60006110eb82611251565b6110f5818561125c565b93506111058185602086016112e8565b61110e816113f0565b840191505092915050565b611122816112bd565b82525050565b600060208201905061113d60008301846110b3565b92915050565b600060608201905061115860008301866110b3565b61116560208301856110b3565b61117260408301846110d1565b949350505050565b600060408201905061118f60008301856110b3565b61119c6020830184611119565b9392505050565b60006020820190506111b860008301846110c2565b92915050565b600060208201905081810360008301526111d881846110e0565b905092915050565b60006020820190506111f56000830184611119565b92915050565b6000611205611216565b9050611211828261134d565b919050565b6000604051905090565b600067ffffffffffffffff82111561123b5761123a6113ad565b5b611244826113f0565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60006112788261129d565b9050919050565b600061128a8261129d565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006112d2826112bd565b9050919050565b82818337600083830152505050565b60005b838110156113065780820151818401526020810190506112eb565b83811115611315576000848401525b50505050565b6000600282049050600182168061133357607f821691505b602082108114156113475761134661137e565b5b50919050565b611356826113f0565b810181811067ffffffffffffffff82111715611375576113746113ad565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61140a8161126d565b811461141557600080fd5b50565b6114218161127f565b811461142c57600080fd5b50565b61143881611291565b811461144357600080fd5b50565b61144f816112bd565b811461145a57600080fd5b5056fea2646970667358221220da7538857ca45df1d67bd7a69be76d8954db948e8bf1a4b2ed837e6af5dff8a164736f6c63430008070033")
}