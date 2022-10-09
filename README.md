# Humanoid
Account abstraction wallet.

Demo Page:
https://main.d27yho91ltireb.amplifyapp.com/

# Polygon 
Polygon is our main side "mempool" where we deploy our main Smart contract that deals with Account Abstraction.



# WalletConnect

We use walletconnect to login to the system via our main wallet in order to reach most of the services, said wallet can also be recovered via PoH.

- Login a la pagina principal, para poder acceder a los multiples servicios que ofrece nuesta plataforma.

<img src="https://i.ibb.co/QNWGjgM/Screenshot-2022-10-09-065704.png">

<img src="https://i.ibb.co/nDfTxdR/Screenshot-2022-10-09-065718.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

- Social Recovery, en ste caso las interaccones con el contrato y la recuperacion de la cuenta se hacen atravez de WalletConnect, para asi reunir las firmas y poder realizar en Upgrade de la Bundler Account.

<img src="https://i.ibb.co/5WVKhKK/Screenshot-2022-10-09-070229.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/recover.js

# Ethereum Foundation

The main technical aspects of the project revolve around reaching a PoC of Account Abstraction using Polygon in this case, but our main purpose is much more related trying to solve ownership disputes creating a public goods offering that can tackle this. Which is one of the biggest problems in LATAM.

- Como parte del modelo de Smart Contract Wallet de Vitalik, tratamos de seguir los siguientes puntos.
  - Multisigs and social recovery
  - Upgradeability

<img src="https://i.ibb.co/TKdVNfb/Screenshot-2022-10-09-074317.png">

- La wallet provee las funciones de recuperarse en el caso de poder comprobar que eres el dueño, para este PoC se decidio usa la huella dactilar o una password.

<img src="https://i.ibb.co/sHv6QLt/Screenshot-2022-10-09-074801.png">

- A su vez una parte muy importante de la wallet, como se pide, es que haya una recuperacion social, siendo podible recuperar una wallet si un grupo de personas lo desea.

<img src="https://i.ibb.co/ZK3p95m/Screenshot-2022-10-09-075009.png">

# Pocket Network

Utilizamos los RPP de pocket network con el fin de poder utilizar varias chains a la vez.

- En el primer caso como nuestra plataforma relizar una revision de, si la wallet de la persona tiene una direccion de ENS o no, esto tiene que realizarse mediante una RPC de Etherum.

<img src="https://i.ibb.co/HxXMhBJ/Screenshot-2022-10-09-070936.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

- En el resto de la aplicacion se utilizo las RPC de polygon ya que toda nuestra solucion corre en esta.

# Streamr Network

Websockets for our IoT fingerprint service and miscelaneous notifications.

Nuestro nodo en Streamr Network: 
https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2375144b3c-f5af-44ed-9be6-393406ea99131

Nuestro Stream: https://streamr.network/network-explorer/streams/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2FHumanoid/

<img src="https://i.ibb.co/MZ5fWhX/Screenshot-2022-10-09-071352.png">

- Ya que el nodo tiene puramente conexiones sin certificado, fue necesario utilizar un sevricio de tunel, para poder conectarnos desde una pagina web en produccion.

<img src="https://i.ibb.co/m9dtV6w/image-11.png">

- En el caso de la plaforma, ya que requiere recibir datos del sensor de huella, se decidio utilizar la red en modo Websockets.

<img src="https://i.ibb.co/hyMZc2K/Screenshot-2022-10-09-071236.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/create.js

- Pol ultimo para poder utlizar nuestro sensor de huella por IoT, se prefirio utilizar el modo mqtt, ya que es mas docil al momento de realizar conexiones con nuestro device.

<img src="https://i.ibb.co/VwxX7DZ/Whats-App-Image-2022-10-09-at-07-17-03.jpg">

Code: https://github.com/EddOliver/Humanoid/blob/main/StreamrNetworkFingerprint/StreamrNetworkFingerprint.ino

# XMTP

Chat messages between wallets and Humanoid users.

- En nuestra plataforma es muy importante darle a los usuarios capacidad de hablar entre ellos, utilizando un metodo seguro y facil de usar, como parte de nuestro proyecto se decidio usar XMTP para el chat el chat privado entre wallets.

<img src="https://i.ibb.co/XSQNdHV/Screenshot-2022-10-09-072921.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

# OpenZeppelin

Smart contracts for ERC-20 and NFTs.

- Para nuestro desarrollo fue indispensable el tener lo contratos de OpenZeppelin a nuestra disposicion, ya que para poder darle las funionalidades correctas a la wallet y poder realizar tranferencias de ERC20 tokens y ERC721.

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