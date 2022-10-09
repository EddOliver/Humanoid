# Humanoid
An Account Abstraction Wallet and DApp that aims to solve ownership problems in Latin America.

Demo Page:
https://main.d27yho91ltireb.amplifyapp.com/

# Polygon 
Polygon is our main side "mempool" where we deploy our main Smart contract that deals with Account Abstraction.

Code: https://github.com/EddOliver/Humanoid/blob/main/Contracts/HumanoidWallet.sol



# WalletConnect

We use walletconnect to login to the system via our main wallet in order to reach most of the services, said wallet can also be recovered via PoH.

- Login to the main webpage, to be able to access the multiple services offered by our platform.

<img src="https://i.ibb.co/QNWGjgM/Screenshot-2022-10-09-065704.png">

<img src="https://i.ibb.co/nDfTxdR/Screenshot-2022-10-09-065718.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

- Social Recovery, in this case, the interactions with the contract and the recovery of the account are made through WalletConnect, in order to gather the signatures and be able to upgrade the Bundler Account.

<img src="https://i.ibb.co/5WVKhKK/Screenshot-2022-10-09-070229.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/recover.js

# Ethereum Foundation

The main technical aspects of the project revolve around reaching a PoC of Account Abstraction using Polygon in this case, but our main purpose is much more related trying to solve ownership disputes creating a public goods offering that can tackle this. Which is one of the biggest problems in LATAM.

- As part of Vitalik's Smart Contract Wallet model, we try to follow the following points.
  - Multisigs and social recovery
  - Upgradeability

<img src="https://i.ibb.co/TKdVNfb/Screenshot-2022-10-09-074317.png">

- The wallet provides the functions of recovering in the case of being able to verify that you are the owner, for this PoC it was decided to use the fingerprint or a password.

<img src="https://i.ibb.co/sHv6QLt/Screenshot-2022-10-09-074801.png">

- In turn, a very important part of the wallet, as requested, is that there is a social recovery, being possible to recover a wallet if a group of people wishes it.

<img src="https://i.ibb.co/ZK3p95m/Screenshot-2022-10-09-075009.png">

# Pocket Network

We use the pocket network's RPC in order to be able to use several chains at the same time.

- In the first case, as our platform performs a review of whether the person's wallet has an ENS address or not, this has to be done through an Etherum RPC.

<img src="https://i.ibb.co/HxXMhBJ/Screenshot-2022-10-09-070936.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

- In the rest of the application, the polygon RPCs were used since all our solution runs in it.

# Streamr Network

Websockets for our IoT fingerprint service and miscelaneous notifications.

Nuestro nodo en Streamr Network: 
https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2375144b3c-f5af-44ed-9be6-393406ea99131

Nuestro Stream: https://streamr.network/network-explorer/streams/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2FHumanoid/

<img src="https://i.ibb.co/MZ5fWhX/Screenshot-2022-10-09-071352.png">

- Since the node has purely connections without a certificate, it was necessary to use a tunnel service, to be able to connect from a web page in production.

<img src="https://i.ibb.co/m9dtV6w/image-11.png">

- In the case of the platform, since it requires receiving data from the fingerprint sensor, it was decided to use the network in Websockets mode.

<img src="https://i.ibb.co/hyMZc2K/Screenshot-2022-10-09-071236.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/create.js

- Finally, to be able to use our IoT fingerprint sensor, it was preferred to use the mqtt mode, since it is more docile when making connections with our device.

<img src="https://i.ibb.co/VwxX7DZ/Whats-App-Image-2022-10-09-at-07-17-03.jpg">

Code: https://github.com/EddOliver/Humanoid/blob/main/StreamrNetworkFingerprint/StreamrNetworkFingerprint.ino

# XMTP

Chat messages between wallets and Humanoid users.

- For us it is very important to give users the ability to talk to each other, using a secure and easy-to-use method, as part of our project it was decided to use XMTP for private chat between wallets.

<img src="https://i.ibb.co/XSQNdHV/Screenshot-2022-10-09-072921.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

# OpenZeppelin

Smart contracts for ERC-20 and NFTs.

- For our development it was essential to have the OpenZeppelin contracts at our disposal, since in order to give the wallet the correct functionalities and be able to make transfers of ERC20 tokens and ERC721.

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

Wallet Contract: https://github.com/EddOliver/Humanoid/blob/main/Contracts/HumanoidWallet.sol 
