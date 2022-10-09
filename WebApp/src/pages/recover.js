import { ethers } from 'ethers';
import React, { Component } from 'react';
import { abi, bytecode } from "../contracts/wallet"
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Input, Row } from 'reactstrap';
import Social from '../component/social';
import reactAutobind from 'react-autobind';

const CryptoJS = require('crypto-js');

const encryptWithAES = (text, pass) => {
    const passphrase = pass;
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext, pass) => {
    const passphrase = pass;
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    let originalText;
    try {
        originalText = bytes.toString(CryptoJS.enc.Utf8);
    }
    catch {
        originalText = "error"
    }
    return originalText;
};


class Recover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            address: "0xbC2Dde04391ED6b6Ccb0233DdA342BdC5BcBD7B1", // ""
            fingerText: "Start",
            privKey: "",
            fingerEncrypted: "",
            passEncrypted: "",
            passphrase: "",
            add1: "",
            add2: "",
            add1Flag: false,
            add2Flag: false,
            wallet: {}
        }
        this.provider = new ethers.providers.JsonRpcProvider(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        this.contract = null
        this.check = null
        reactAutobind(this);
    }

    componentDidMount() {
        this.connectPub()
        this.connectSub()
    }

    componentWillUnmount() {
        this.check ?? clearInterval(this.check)
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
                    privKey: decryptWithAES(this.state.fingerEncrypted, JSON.parse(message.data).com),
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

    async checkFlags() {
        let contract = new ethers.Contract(this.state.address, abi(), this.provider);
        let [
            add1Flag,
            add2Flag,
        ] = await Promise.all(
            [
                contract.recover1(),
                contract.recover2(),
            ]
        )
        this.setState({
            add1Flag,
            add2Flag
        }, () => console.log([add1Flag, add2Flag]))
    }

    render() {
        return (
            <div>
                {
                    this.state.stage === 0 &&
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "12%" }}>
                        <Card style={{ width: window.innerWidth * 0.3 }}>
                            <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                Please write the Humanoid Wallet to recover
                            </CardHeader>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Input value={this.state.address} onChange={(e) => this.setState({
                                        address: e.target.value
                                    })} />
                                </div>
                            </CardBody>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={async () => {
                                        let contract = new ethers.Contract(this.state.address, abi(), this.provider);
                                        console.log(contract)
                                        let [
                                            fingerEncrypted,
                                            passEncrypted,
                                            add1Flag,
                                            add2Flag,
                                            add1,
                                            add2,
                                        ] = await Promise.all(
                                            [
                                                contract.EcryptedFinger(),
                                                contract.EcryptedPass(),
                                                contract.recover1(),
                                                contract.recover2(),
                                                contract.PubKeyRecover1(),
                                                contract.PubKeyRecover2()
                                            ]
                                        )
                                        this.setState({
                                            stage: 1,
                                            fingerEncrypted,
                                            passEncrypted,
                                            add1,
                                            add2,
                                            add1Flag,
                                            add2Flag
                                        }, () => {
                                            this.check = setInterval(() => this.checkFlags(), 5000)
                                        })
                                    }}>
                                        Continue
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                }
                {
                    this.state.stage === 1 &&
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "6%" }}>
                        <Card style={{ width: window.innerWidth * 0.3 }}>
                            <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                Account recovery options
                            </CardHeader>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    PrivateKey Recovery with Fingerprint
                                </div>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => this.setState({
                                        stage: 2
                                    })}>
                                        Fingeprint
                                    </Button>
                                </div>
                            </CardBody>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    PrivateKey Recovery with Passphrase
                                </div>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => this.setState({
                                        stage: 3
                                    })}>
                                        Passphrase
                                    </Button>
                                </div>
                            </CardBody>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    Account Upgrade (this process will change the Bundler Address)
                                </div>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => this.setState({
                                        stage: 4
                                    })}>
                                        Social Recovery
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                }
                {
                    this.state.stage === 2 &&
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "6%" }}>
                        <Card style={{ width: window.innerWidth * 0.3 }}>
                            <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                Perform a fingerprint scan to retrieve the private key
                            </CardHeader>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button disabled={this.state.fingerText !== "Start"} style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => {
                                        this.setState({
                                            fingerText: "Reading..."
                                        })
                                        fetch("https://jazbjsd8kj.execute-api.us-east-1.amazonaws.com/read-sensor", {
                                            method: 'GET',
                                            redirect: 'follow'
                                        })
                                            .then(response => response.text())
                                            .then(result =>
                                                this.setState({
                                                    fingerText: "Start"
                                                }))
                                            .catch(error => console.log('error', error));
                                    }}>
                                        {
                                            this.state.fingerText
                                        }
                                    </Button>
                                </div>
                            </CardBody>
                            {
                                this.state.privKey &&
                                <CardBody>
                                    <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                        PrivateKey
                                    </div>
                                    <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                        {
                                            this.state.privKey
                                        }
                                    </div>
                                </CardBody>
                            }
                        </Card>
                    </div>
                }
                {
                    this.state.stage === 3 &&
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "6%" }}>
                        <Card style={{ width: window.innerWidth * 0.3 }}>
                            <CardHeader style={{ textAlign: "center", fontSize: "1.5rem" }}>
                                Write your Passphrase to retrieve the private key
                            </CardHeader>
                            <CardBody>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Input type='password' onChange={(e) => this.setState({
                                        passphrase: e.target.value
                                    })} />
                                </div>
                                <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                    <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={() => {
                                        this.setState({
                                            privKey: decryptWithAES(this.state.passEncrypted, this.state.passphrase),
                                        })
                                    }}>
                                        Decrypt
                                    </Button>
                                </div>
                            </CardBody>
                            {
                                this.state.privKey !== "" &&
                                <CardBody>
                                    <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                        PrivateKey
                                    </div>
                                    <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                        {
                                            this.state.privKey
                                        }
                                    </div>
                                </CardBody>
                            }
                        </Card>
                    </div>
                }
                {
                    this.state.stage === 4 &&
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "6%" }}>
                        <h1>
                            To change the Bundler Address, both addresses must give their vote.
                        </h1>
                        <p />
                        <Row md="2">
                            <Col>

                                {
                                    this.state.add1Flag ?
                                        <Card style={{ width: window.innerWidth * 0.4, marginLeft: "100px", textAlign: "center" }}>
                                            <CardHeader>
                                                {
                                                    this.state.add1
                                                }
                                                <p />
                                                Already voted to change the Bundler Address
                                            </CardHeader>
                                        </Card>
                                        :
                                        <Social address={this.state.add1} contract={this.state.address} flag={false} />
                                }
                            </Col>
                            <Col>
                                {
                                    this.state.add2Flag ?
                                        <Card style={{ width: window.innerWidth * 0.4, marginRight: "100px", textAlign: "center" }}>
                                            <CardHeader>
                                                {
                                                    this.state.add2
                                                }
                                                <p />
                                                Already voted to change the Bundler Address
                                            </CardHeader>
                                        </Card>
                                        :
                                        <Social address={this.state.add2} contract={this.state.address} flag={true} />
                                }
                            </Col>
                        </Row>
                        <Row md="1" style={{ marginTop: "60px" }}>
                            {
                                this.state.add1Flag && this.state.add2Flag &&
                                <>
                                    {
                                        this.state.wallet.address === undefined ?
                                            <Col>
                                                <Card>
                                                    <CardHeader>
                                                        Pressing this button will completely change the Bundler Address.
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div style={{ margin: "20px 0px", textAlign: "center" }}>
                                                            <Button style={{ width: window.innerWidth * 0.16, height: window.innerHeight * 0.08 }} size='lg' color="primary" onClick={async () => {
                                                                const wallet = ethers.Wallet.createRandom()
                                                                this.setState({
                                                                    wallet
                                                                })
                                                            }}>
                                                                Continue
                                                            </Button>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            :
                                            <Col>
                                                <Card style={{textAlign:"center"}}>
                                                    <CardHeader>
                                                        Address: {this.state.wallet.address}
                                                    </CardHeader>
                                                    <CardBody>
                                                        Mnemonic: {this.state.wallet.mnemonic.phrase}
                                                    </CardBody>
                                                    <CardFooter>
                                                        PrivateKey: {this.state.wallet.privateKey}
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                    }
                                </>
                            }
                        </Row>
                    </div>
                }
            </div>
        );
    }
}

export default Recover;