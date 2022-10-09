import React, { Component } from 'react';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import autoBind from 'react-autobind';
import { Button, Card, CardBody, CardHeader, Col, Input, Row } from 'reactstrap';
import { ethers } from 'ethers'
import ContextModule from '../utils/contextModule';
import { abi2 } from '../contracts/register';
import { abi3 } from "../contracts/priceFeedContract";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Client } from '@xmtp/xmtp-js';
import Web3 from 'web3';
import usdt from "../assets/usdt.png"
import axios from 'axios';
import wc from "../assets/wclogo.png"
// Price feeds
import avax from "../images/avax.png";
import bnb from "../images/bnb.png";
import btc from "../images/btc.png";
import dot from "../images/polkadot.png"
import eth from "../images/eth.png";
import fil from "../images/fil.png"
import link from "../images/link.png";
import matic from "../images/polygon.png";
import neo from "../images/neo.png"
import sol from "../images/sol.png";
import usdc from "../images/usdc.png";
import xrp from "../images/xrp.png"

const priceFeed = "0xFE006128fD276f29CDadd330f60be53B53285e8f"

const IPFSgateways = [
    "https://ipfs.io/ipfs/",
    "https://cf-ipfs.com/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    "https://gateway.ipfs.io/ipfs/",
    "https://gateway.valist.io/ipfs/"
]
const IPFSgateway = IPFSgateways[0]

function epsilonRound(num) {
    const zeros = 2;
    return Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) / Math.pow(10, zeros)
}

function ipfsTohtml2(uri) {
    return uri.replace("ipfs://", IPFSgateway)
}

function ipfsTohtml(uri) {
    let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
    let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
    return substring + substring2
}

async function fetchAsyncBalance(url) {
    return new Promise((resolve, reject) => {
        fetch(url, { method: 'GET', redirect: 'follow' })
            .then(result => result.text())
            .then((response) => {
                let temp = JSON.parse(response)
                let money = {}
                for (let i = 0; i < temp.data.items.length; i++) {
                    money[temp.data.items[i].contract_ticker_symbol] = temp.data.items[i].balance
                }
                resolve(money)
            })
            .catch((error) => {
                console.log(error);
            })
    })
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            amount: "",
            amountUSDC: "",
            amountUSDT: "",
            main: "",
            contract: "",
            message: "",
            dmAddress: "",
            historyDM: [{
                // Seed Value to Filter
                address: "",
                message: ""
            }],
            // Price Feeds
            avax: 0,
            bnb: 0,
            btc: 0,
            dot: 0,
            eth: 0,
            link: 0,
            matic: 0,
            neo: 0,
            sol: 0,
            usdc: 0,
            xrp: 0,
            prices: [],
            symbol: ["AVAX", "BNB", "BTC", "DOT", "ETH", "FIL", "LINK", "MATIC", "NEO", "SOL", "USDC", "XRP"],
            icons: [avax, bnb, btc, dot, eth, fil, link, matic, neo, sol, usdc, xrp],
        }
        this.messagesEndRef = React.createRef()
        this.conversation = null
        this.balanceCheck = null
        this.connector = new WalletConnectProvider({
            rpc: {
                1: `https://eth-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`,
                137: `https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`,
            },
        });
        this.web3 = new Web3(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.providerPoly = new ethers.providers.JsonRpcProvider(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.resolve = null
        autoBind(this);
    }

    static contextType = ContextModule;

    async connectWC() {

        // Subscribe to accounts change
        this.connector.on("accountsChanged", async (accounts) => {
            !this.balanceCheck && clearInterval(this.balanceCheck)
            var name = await this.provider.lookupAddress(accounts[0]);
            let contract = await this.resolve.Registers(accounts[0], 0);
            contract = contract.cont
            this.context.setValue({
                address: name ?? accounts[0],
                contract: contract ?? accounts[0],
            })
            let amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${contract}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
            this.setState({
                amount: this.web3.utils.fromWei(amount["MATIC"] ?? "0", "ether"),
                amountUSDC: this.web3.utils.fromWei(amount["USDC"] ?? "0", "lovelace"),
                amountUSDT: this.web3.utils.fromWei(amount["USDT"] ?? "0", "lovelace"),
            })
            this.syncNFT(accounts[0])
            this.getPriceFeed()
            this.balanceCheck = setInterval(async () => {
                this.getPriceFeed()
                this.syncNFT(accounts[0])
                amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${contract}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
                this.setState({
                    amount: this.web3.utils.fromWei(amount["MATIC"] ?? "0", "ether"),
                    amountUSDC: this.web3.utils.fromWei(amount["USDC"] ?? "0", "lovelace"),
                    amountUSDT: this.web3.utils.fromWei(amount["USDT"] ?? "0", "lovelace"),
                })
            }, 30000);
        });

        this.connector.on("connect", () => {
            console.log("Connected");
        });

        // Subscribe to chainId change
        this.connector.on("chainChanged", (chainId) => {
            console.log(chainId);
        });

        // Subscribe to session disconnection
        this.connector.on("disconnect", (code, reason) => {
            console.log(code, reason);
        });
        /*
        this.connector.on("session_update", (error, payload) => {
            if (error) {
                throw error;
            }
            const { accounts, chainId } = payload.params[0];
            console.log("Update")
            console.log(accounts[0])
        });

        this.connector.on("disconnect", (error, payload) => {
            if (error) {
                throw error;
            }
        });
        */
        await this.connector.enable();
    }

    async componentDidMount() {
        this.resolve = new ethers.Contract("0x40d0fa499Aa8d4f21F8cd1663C762C838E3f3976", abi2(), this.providerPoly);
    }

    componentWillUnmount() {
        clearInterval(this.balanceCheck)
    }

    async sendMessageXMTP() {
        let tempMes = this.state.message
        /*
        this.socketPub.send(JSON.stringify({
            address: this.context.value.address,
            to: this.state.to,
            message: tempMes,
            dm: true
        }))
        */
        this.conversation.send(JSON.stringify({
            address: this.context.value.address,
            message: tempMes
        }))
        this.setState({
            message: "",
        })
    }

    async startDM(address) {
        const provider = new ethers.providers.Web3Provider(this.connector, "any")
        const xmtp = await Client.create(provider.getSigner())
        // It is very important that the Address is correctly written with ChecksumAddress, otherwise XMTP will not work.
        this.conversation = await xmtp.conversations.newConversation(this.web3.utils.toChecksumAddress(address))
        const messages = await this.conversation.messages()
        let tempMessages = [{
            // Seed Value to Filter
            address: "",
            message: ""
        }]
        messages.forEach((item, index) => {
            try {

                tempMessages.push(JSON.parse(item.content))
            }
            catch {
                //
            }
        })
        this.setState({
            historyDM: tempMessages
        })
        // Listen for new messages in the this.conversation
        const account = this.web3.utils.toChecksumAddress(address)
        for await (const message of await this.conversation.streamMessages()) {
            if (account !== this.web3.utils.toChecksumAddress(address)) {
                console.log("Break:" + account)
                break
            }
            let historyDM = this.state.historyDM
            if (historyDM[historyDM.length - 1].message !== JSON.parse(message.content).message) {
                historyDM.push({
                    address: message.senderAddress,
                    message: JSON.parse(message.content).message
                })
                this.setState({
                    historyDM
                })
            }
        }
    }

    connectSub() {
        this.socketSub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid")}/subscribe?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketSub.addEventListener('open', () => {
            this.setState({
                readySub: true
            }, () => console.log("Sub Ready"))
        })
        this.socketSub.addEventListener('message', (message) => {
            if (JSON.parse(message.data).dest === "plat" && JSON.parse(message.data).device !== "esp") {
                console.log(JSON.parse(message.data))
            }
        })
        this.socketSub.addEventListener('close', () => {
            this.setState({
                readySub: false
            }, () => setTimeout(() => {
                this.connectSub()
            }, 5000))
        })

    }

    connectPub() {
        this.socketPub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid")}/publish?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketPub.addEventListener('open', () => {
            this.setState({
                readyPub: true
            }, () => console.log("Pub Ready"))
        })
        this.socketPub.addEventListener('close', () => {
            this.connectPub()
            this.setState({
                readyPub: false
            }, () => setTimeout(() => {
                this.connectPub()
            }, 5000))
        })
    }

    async syncNFT(address) {
        let contractsNFT = []
        let temp = await axios({
            method: 'get',
            url: `https://api.covalenthq.com/v1/137/address/${address}/balances_v2/?key=${process.env.REACT_APP_Covalent}&format=JSON&nft=true&no-nft-fetch=false`,
            headers: {
                'Accept': 'application/json'
            }
        })
        temp = temp.data.data.items.filter(item => item.type === "nft");
        if (temp.length > 0) {
            temp = temp.map((item) => item.nft_data)
            temp = temp[0]
            temp = temp.map((item) => item.external_data)
            console.log(temp)
            if (this.state.nfts.length !== temp.length) {
                this.setState({
                    nfts: temp
                }, () => console.log(temp))
            }
        }
    }

    async getPriceFeed() {
        try {
            let contract = new ethers.Contract(priceFeed, abi3(), this.providerPoly);
            let [
                priceAVAX,
                priceBNB,
                priceBTC,
                priceDOT,
                priceETH,
                priceLINK,
                priceMATIC,
                priceNEO,
                priceSOL,
                priceUSDC,
                priceXRP
            ] = await Promise.all(
                [
                    contract.getLatestAVAXPrice(),
                    contract.getLatestBNBPrice(),
                    contract.getLatestBTCPrice(),
                    contract.getLatestDOTPrice(),
                    contract.getLatestETHPrice(),
                    contract.getLatestLINKPrice(),
                    contract.getLatestMATICPrice(),
                    contract.getLatestNEOPrice(),
                    contract.getLatestSOLPrice(),
                    contract.getLatestUSDCPrice(),
                    contract.getLatestXRPPrice()
                ])
            let prices = {
                avax: parseFloat((priceAVAX).toString()) / 100000000,
                bnb: parseFloat((priceBNB).toString()) / 100000000,
                btc: parseFloat((priceBTC).toString()) / 100000000,
                dot: parseFloat((priceDOT).toString()) / 100000000,
                eth: parseFloat((priceETH).toString()) / 100000000,
                link: parseFloat((priceLINK).toString()) / 100000000,
                matic: parseFloat((priceMATIC).toString()) / 100000000,
                neo: parseFloat((priceNEO).toString()) / 100000000,
                sol: parseFloat((priceSOL).toString()) / 100000000,
                usdc: parseFloat((priceUSDC).toString()) / 100000000,
                xrp: parseFloat((priceXRP).toString()) / 100000000,
            }
            this.setState({
                prices: [
                    epsilonRound(prices.avax),
                    epsilonRound(prices.bnb),
                    epsilonRound(prices.btc),
                    epsilonRound(prices.dot),
                    epsilonRound(prices.eth),
                    epsilonRound(prices.link),
                    epsilonRound(prices.matic),
                    epsilonRound(prices.neo),
                    epsilonRound(prices.sol),
                    prices.usdc,
                    epsilonRound(prices.xrp),
                ],
            })
        }
        catch {
            // nothing
        }
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {
                    !this.context.value.address ?
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "12%" }}>
                            <Card style={{ width: window.innerWidth * 0.3 }}>
                                <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                    Login
                                </CardHeader>
                                <CardBody>
                                    <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                        <img src={wc} width="180px" onClick={() => this.connectWC()} />
                                        <br />
                                        <br />
                                        <div style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                            Login with WalletConnect
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        :
                        <div style={{ width: "90%" }}>
                            <h2 style={{ textAlign: "center" }}>
                                Bundler Address: {this.context.value.address}
                            </h2>
                            <h2 style={{ textAlign: "center" }}>
                                Wallet Address: {this.context.value.contract}
                            </h2>
                            <br />
                            <Row md="4">
                                <Col xs="3">
                                    <Card>
                                        <CardHeader>
                                            Price Feeds
                                        </CardHeader>
                                        <CardBody>
                                            {
                                                this.state.prices.length > 0 &&
                                                <Row
                                                    md="1"
                                                    style={{
                                                        height: "71vh",
                                                        overflowX: 'hidden',
                                                        overflowY: 'scroll',
                                                    }}>
                                                    {
                                                        this.state.prices.map((price, index) => {
                                                            return (
                                                                <Col key={"price" + index} style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}>
                                                                    <Card
                                                                        style={{
                                                                            margin: '10px',
                                                                            padding: '10px',
                                                                            width: '100%',
                                                                            borderColor: '#1b5eb5',
                                                                        }}>
                                                                        <Row md="3" style={{
                                                                            textAlign: "center"
                                                                        }}>
                                                                            <Col xs="4" style={{
                                                                                fontSize: '16px',
                                                                                fontWeight: 'bold',
                                                                            }}>{this.state.symbol[index]}
                                                                            </Col>
                                                                            <Col xs="4" style={{
                                                                                fontSize: '16px',
                                                                                fontWeight: 'bold',
                                                                            }}>
                                                                                <img alt="myimages" src={this.state.icons[index]} style={{
                                                                                    width: '40px',
                                                                                }} />
                                                                            </Col>
                                                                            <Col xs="4" style={{
                                                                                fontSize: '14px',
                                                                                fontWeight: 'bold',
                                                                            }}>
                                                                                ${price}
                                                                            </Col>
                                                                        </Row>
                                                                    </Card>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs="3">
                                    <Card style={{ height: window.innerHeight * 0.8 }}>
                                        <CardHeader>
                                            <span style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                                Chat with
                                            </span>
                                            <br />
                                            <br />
                                            <Row>
                                                <Col xs="7">
                                                    <Input
                                                        value={this.state.dmAddress}
                                                        placeholder={"Address"}
                                                        onChange={(e) => this.setState({ dmAddress: e.target.value })}
                                                        onKeyDown={(e) => { e.key === "Enter" && this.startDM(this.state.dmAddress) }}
                                                    />
                                                </Col>
                                                <Col xs="5">
                                                    <Button color="primary" onClick={() => {
                                                        this.startDM(this.state.dmAddress)
                                                    }}>
                                                        Start DM
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody style={{ height: window.innerHeight * 0.7 }}>
                                            <>
                                                <div style={{ height: "90%", width: "100%", overflowY: "scroll", borderBottom: "1px solid #555" }}>
                                                    {
                                                        this.state.historyDM.map((item, index) => {
                                                            return (
                                                                <div key={"Message" + index} style={{ margin: "0px 10px 0px" }}>
                                                                    {
                                                                        item.address !== "" &&
                                                                        <>
                                                                            <span style={{ cursor: "pointer", color: `#${item.address.substring(2, 8)}` }} onClick={() => window.open(`https://polygonscan.com/address/${item.address}`, "_blank")}>
                                                                                {item.address.substring(0, 4)}
                                                                                ...
                                                                                {item.address.substring(item.address.length - 4, item.address.length)}
                                                                            </span>
                                                                            <span style={{ color: "black", wordWrap: "break-word" }}>
                                                                                &nbsp;:&nbsp;{item.message}{"\n"}
                                                                            </span></>
                                                                    }
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                    <div ref={this.messagesEndRef} />
                                                </div>
                                                <div style={{ color: "white", padding: "3% 0% 3% 0%", borderBottom: "1px solid #555", width: "100%", textAlign: "center", display: "flex", flexDirection: "row" }}>
                                                    <Input
                                                        value={this.state.message}
                                                        placeholder={"Send Message"}
                                                        style={{ width: "80%", marginLeft: "5%", marginRight: "2%" }}
                                                        onChange={(e) => this.setState({ message: e.target.value })}
                                                        onKeyDown={(e) => { e.key === "Enter" && this.sendMessageXMTP() }}
                                                    />
                                                    <Button color="primary" style={{ marginRight: "5%" }} onClick={() => {
                                                        this.sendMessageXMTP()
                                                    }}>
                                                        Send
                                                    </Button>
                                                </div>
                                            </>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs="3">
                                    <Card style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                        <CardHeader>
                                            Native Token and ERC20
                                        </CardHeader>
                                        <CardBody>
                                            MATIC balance <br />
                                            {
                                                this.state.amount
                                            }
                                            {
                                                " "
                                            }
                                            <img src={matic} width="8%" />
                                        </CardBody>
                                        <CardBody>
                                            USDC balance <br />
                                            {
                                                this.state.amountUSDC
                                            }
                                            {
                                                " "
                                            }
                                            <img src={usdc} width="8%" />
                                        </CardBody>
                                        <CardBody>
                                            USDT balance <br />
                                            {
                                                this.state.amountUSDT
                                            }
                                            {
                                                " "
                                            }
                                            <img src={usdt} width="8%" />
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs="3">
                                    <Card>
                                        <CardHeader>
                                            Physical Assets
                                        </CardHeader>
                                        <CardBody style={{ height: window.innerHeight * 0.75, width: "100%", overflowY: "scroll" }}>
                                            {
                                                this.state.nfts.map((item, index) =>
                                                    <div key={"nft" + index} style={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", borderBottom: "1px solid gray", padding: "20px 0px" }}>
                                                        <img alt='ig0001' width={"80%"} src={item.image.replace("/ipfs/ipfs", "/ipfs")} />
                                                        <span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                                                            {
                                                                item.name
                                                            }
                                                        </span>
                                                        <Row md="2">
                                                            <Col style={{ height: "100%" }}>
                                                                Price:{
                                                                    JSON.parse(item.description).price
                                                                }
                                                                <br />
                                                            </Col>
                                                            <Col>
                                                                Size:{" "}{
                                                                    JSON.parse(item.description).size
                                                                }
                                                                <br />
                                                            </Col>
                                                            <Col>
                                                                Rooms:{" "}{
                                                                    JSON.parse(item.description).rooms
                                                                }
                                                                <br />
                                                            </Col>
                                                            <Col>
                                                                Baths:{" "}{
                                                                    JSON.parse(item.description).baths
                                                                }
                                                                <br />
                                                            </Col>
                                                            <Col>
                                                                Location:{" "}{
                                                                    JSON.parse(item.description).location
                                                                }
                                                                <br />
                                                            </Col>
                                                            <Col>
                                                                Coordinates:{" "}{
                                                                    JSON.parse(item.description)["lon-lat"]
                                                                }
                                                                <br />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                }
            </div>
        );
    }
}

export default Login;