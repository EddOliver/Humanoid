import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Input, Row } from 'reactstrap';
import autoBind from 'react-autobind';
import QRCode from "react-qr-code";
import { abi, bytecode } from "../contracts/wallet"
import { ethers, ContractFactory } from 'ethers'
import { abi2 } from '../contracts/register';
import logo from "../assets/logo.png"
import Web3 from 'web3';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const CryptoJS = require('crypto-js');

const encryptWithAES = (text, pass) => {
    const passphrase = pass;
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            mnemonic: "",
            privateKey: "",
            address: "",
            address1: "",
            address2: "",
            finger: "",
            fingerState: 0,
            fingerFinal: "",
            face: "",
            passphrase: "",
            passphraseState: 0,
            passphraseFinal: "",
            readyPub: false,
            readySub: false
        }
        this.provider = new ethers.providers.JsonRpcProvider(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.web3 = new Web3(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.wallet = null
        autoBind(this);
        this.socketSub = null
        this.socketPub = null
    }

    componentDidMount() {
        const ethers = require('ethers')
        this.connectPub()
        this.connectSub()
        const wallet = ethers.Wallet.createRandom()
        console.log(wallet.address)
        this.wallet = wallet
        this.setState({
            mnemonic: wallet.mnemonic.phrase,
            privateKey: wallet.privateKey,
            address: wallet.address,
        })
    }

    componentWillUnmount() {

    }

    async addRegister(address) {
        return new Promise(async (resolve, reject) => {
            const register = new this.web3.eth.Contract(abi2(), "0x40d0fa499Aa8d4f21F8cd1663C762C838E3f3976", { from: this.state.address })
            var tx = {
                from: this.state.address,
                to: "0x40d0fa499Aa8d4f21F8cd1663C762C838E3f3976",
                data: register.methods.addRegister(address).encodeABI()
            };
            const gasAmount = await this.web3.eth.estimateGas(tx);
            tx = {
                ...tx,
                gas: gasAmount
            }
            this.web3.eth.accounts.signTransaction(tx, this.state.privateKey).then(signed => {
                var tran = this.web3.eth.sendSignedTransaction(signed.rawTransaction);
                tran.on('confirmation', (confirmationNumber, receipt) => {
                    console.log('confirmation: ' + confirmationNumber);
                });
                tran.on('transactionHash', hash => {
                    console.log('hash');
                    resolve(hash)
                    console.log(hash);
                });
                tran.on('receipt', receipt => {
                    console.log('reciept');
                    console.log(receipt);
                });
                tran.on('error', console.error);
            });
        })
    }

    async createContract() {
        const signer = new ethers.Wallet(this.wallet, this.provider);
        let factory = new ContractFactory(abi(), bytecode(), signer)
        const contract = await factory.deploy(this.state.address1, this.state.address2, this.state.fingerFinal, this.state.face, this.state.passphraseFinal, { gasLimit: 3000000, gasPrice: this.provider.getGasPrice() });
        console.log(contract.address)
        console.log(contract.deployTransaction)
        await contract.deployTransaction.wait()
        await this.addRegister(contract.address)
        this.setState({
            stage: 5
        })
    }

    connectSub() {
        this.socketSub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/Humanoid")}/subscribe?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketSub.addEventListener('open', () => {
            this.setState({
                readySub: true
            }, () => console.log("Sub Ready"))
        })
        this.socketSub.addEventListener('message', (message) => {
            if (JSON.parse(message.data).dest === "plat") {
                console.log(JSON.parse(message.data))
                this.setState({
                    finger: JSON.parse(message.data).com,
                    fingerState: 2
                })
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

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: "90%" }}>
                    <h1 style={{ textAlign: "center" }}>
                        Create your new wallet
                    </h1>
                    <br />
                    <Card>
                        <Row>
                            {
                                this.state.stage === 0 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%" }}>
                                            <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                                Let's start setting up your new Humanoid Wallet
                                            </CardHeader>
                                            <CardBody style={{ textAlign: "center" }}>
                                                <Button style={{ fontSize: "1.5rem" }} disabled={this.state.fingerState > 2} size='lg' color="primary" onClick={() => this.setState({
                                                    stage: 1
                                                })}>
                                                    Start
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            }
                            {
                                this.state.stage === 1 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%" }}>
                                            <CardHeader style={{ fontSize: "1.5rem" }}>
                                                Social recovery Addresses
                                            </CardHeader>
                                            <CardBody style={{ fontSize: "1.5rem" }}>
                                                <br />
                                                Social recovery wallets are not a betrayal, but rather an expression, of "crypto values".
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                Address 1:
                                                <Input value={this.state.address1} onChange={(e) => this.setState({
                                                    address1: e.target.value
                                                })} />
                                            </CardBody>
                                            <CardBody style={{ fontSize: "1.5rem" }}>
                                                Address 2:
                                                <Input value={this.state.address2} onChange={(e) => this.setState({
                                                    address2: e.target.value
                                                })} />
                                            </CardBody>
                                            <CardBody style={{ fontSize: "1.5rem" }}>
                                                <Button disabled={this.state.fingerState > 2} size='lg' color="primary" onClick={() => this.setState({
                                                    stage: 2
                                                })}>
                                                    Continue
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            }
                            {
                                this.state.stage === 2 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%", textAlign: "center", }}>
                                            <CardHeader style={{ fontSize: "1.5rem" }}>
                                                Setup Fingeprint
                                            </CardHeader>
                                            <CardBody>
                                                <Row md="1">
                                                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <FingerprintIcon style={{ fontSize: "20rem" }} />
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: "20px" }}>
                                                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => {
                                                            if (this.state.fingerState < 1) {
                                                                fetch("https://jazbjsd8kj.execute-api.us-east-1.amazonaws.com/read-sensor", {
                                                                    method: 'GET',
                                                                    redirect: 'follow'
                                                                })
                                                                    .then(response => response.text())
                                                                    .then(result =>
                                                                        this.setState({
                                                                            fingerState: 1
                                                                        }))
                                                                    .catch(error => console.log('error', error));
                                                            }
                                                            else if (this.state.fingerState === 2) {
                                                                this.setState({
                                                                    fingerState: 3,
                                                                    fingerFinal: encryptWithAES(this.state.privateKey, this.state.finger)
                                                                })
                                                            }
                                                            else if (this.state.fingerState === 3) {
                                                                this.setState({
                                                                    stage: 3
                                                                })
                                                            }
                                                        }}>
                                                            {
                                                                this.state.fingerState === 0 && "Get Fingerprint"
                                                            }
                                                            {
                                                                this.state.fingerState === 1 && "Waiting for fingerprint..."
                                                            }
                                                            {
                                                                this.state.fingerState === 2 && "Claim Fingerprint"
                                                            }
                                                            {
                                                                this.state.fingerState === 3 && "Continue"
                                                            }
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            }
                            {
                                this.state.stage === 3 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%", textAlign: "center", }}>
                                            <CardHeader style={{ fontSize: "1.5rem" }}>
                                                Setup Passphrase
                                            </CardHeader>
                                            <br />
                                                <br />
                                                <br />
                                            <CardBody >
                                                <Input type='password' onChange={(e) => this.setState({
                                                    passphrase: e.target.value
                                                })} />
                                            </CardBody>
                                            <CardBody>
                                                <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => {
                                                    if (!this.state.passphraseState) {
                                                        this.setState({
                                                            passphraseState: 1,
                                                            passphraseFinal: encryptWithAES(this.state.privateKey, this.state.passphrase)
                                                        },()=>console.log(this.state.passphraseFinal))
                                                    }
                                                    else {
                                                        this.setState({
                                                            stage: 4
                                                        })
                                                    }
                                                }}>
                                                    {
                                                        this.state.passphraseState === 0 && "Set Passphrase"
                                                    }
                                                    {
                                                        this.state.passphraseState === 1 && "Continue"
                                                    }
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            }
                            {
                                this.state.stage === 4 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%" }}>
                                            <CardHeader>
                                                Fund the Wallet and click Create Wallet
                                            </CardHeader>
                                            <CardBody>
                                                Address: {this.state.address}
                                                <p />
                                                {
                                                    this.state.address &&
                                                    <QRCode
                                                        size={100}
                                                        style={{ height: "auto", maxWidth: "60%", width: "60%" }}
                                                        value={this.state.address}
                                                        viewBox={`0 0 100 100`}
                                                    />
                                                }
                                            </CardBody>
                                            <CardBody>
                                                <Button disabled={false} size='lg' color="primary" onClick={() => this.createContract()}>
                                                    Create Wallet
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            }
                            {
                                this.state.stage === 5 &&
                                <>
                                    <Col xs="6">
                                        <img src={logo} width="80%" style={{ alignSelf: "center" }} />
                                    </Col>
                                    <Col xs="6">
                                        <Card style={{ backgroundColor: "whitesmoke", height: "100%" }}>
                                            <CardHeader>
                                                Address: {this.state.address}
                                            </CardHeader>
                                            <CardBody>
                                                Mnemonic: {this.state.mnemonic}
                                            </CardBody>
                                            <CardFooter>
                                                PrivateKey: {this.state.privateKey}
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </>
                            }
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Create;