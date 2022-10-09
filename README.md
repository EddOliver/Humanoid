# Humanoid
Account abstraction wallet.

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



# Pocket Network

Utilizamos los RPP de pocket network con el fin de poder utilizar varias chains a la vez.

- En el primer caso como nuestra plataforma relizar una revision de, si la wallet de la persona tiene una direccion de ENS o no, esto tiene que realizarse mediante una RPC de Etherum.

<img src="https://i.ibb.co/HxXMhBJ/Screenshot-2022-10-09-070936.png">

Code: https://github.com/EddOliver/Humanoid/blob/main/WebApp/src/pages/login.js

- En el resto de la aplicacion se utilizo las RPC de polygon ya que toda nuestra solucion corre en esta.

# Streamr Network

Websockets for our IoT fingerprint service and miscelaneous notifications.

Nuestro nodo:

Streamr Network Explorer: https://streamr.network/network-explorer/streams/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2FHumanoid/

<img src="https://i.ibb.co/MZ5fWhX/Screenshot-2022-10-09-071352.png">

- En el caso de la plaforma, ya que requiere recibir datos del sensor de huella, se decidio utilizar la red en modo Websockets.

<img src="https://i.ibb.co/hyMZc2K/Screenshot-2022-10-09-071236.png">

- Pol ultimo para poder utlizar nuestro sensor de huella por IoT, se prefirio utilizar el modo mqtt, ya que es mas docil al momento de realizar conexiones con nuestro device.

<img src="https://i.ibb.co/VwxX7DZ/Whats-App-Image-2022-10-09-at-07-17-03.jpg">

Code: 

# XMTP

Chat messages between wallets and Humanoid users.



# OpenZeppelin

Smart contracts for ERC-20 and NFTs.


