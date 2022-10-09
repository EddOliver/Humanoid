import { ethers } from 'ethers';
import React, { Component } from 'react';
import { abi, bytecode } from "../contracts/wallet"
import { Button, Card, CardBody, CardHeader, Col, Input, Row } from 'reactstrap';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from 'web3';
import reactAutobind from 'react-autobind';

class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0
        }
        this.connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
        });
        this.web3 = new Web3(`https://poly-mainnet.gateway.pokt.network/v1/lb/${process.env.REACT_APP_Pocket}`)
        reactAutobind(this);
    }

    async connectWC() {

        if (!this.connector.connected) {
            // create new session
            this.connector.createSession();
        }

        // Subscribe to connection events
        this.connector.on("connect", (error, payload) => {
            if (error) {
                throw error;
            }
            const { accounts, chainId } = payload.params[0];
            if (accounts[0].toLowerCase() === this.props.address.toLowerCase()) {
                this.setState({
                    stage: 1
                })
            }
            else {
                this.connector.killSession();
            }
        });

        this.connector.on("disconnect", (error, payload) => {
            if (error) {
                throw error;
            }
        })
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.this.connector.killSession();
    }

    async changeVote() {
        const contract = new this.web3.eth.Contract(abi(), this.props.contract, { from: this.props.address })
        const myABI = this.props.flag ? contract.methods.recover2Flag().encodeABI() : contract.methods.recover1Flag().encodeABI()
        let transaction = {
            to: this.props.contract,
            from: this.props.address,
            data: myABI
        }
        this.connector.sendTransaction(transaction)
            .then((result) => {
                this.mount && this.setState({
                    signature: result,
                }, () => { this.connector.killSession() })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        {
                            this.state.stage === 0 &&
                            <div>
                                Please connect {
                                    this.props.address
                                }
                            </div>
                        }
                        {
                            this.state.stage === 1 &&
                            <div>
                                To confirm that you want to change the address of the package, press the button
                            </div>
                        }
                    </CardHeader>
                    <CardBody>
                        {
                            this.state.stage === 0 &&
                            <div>
                                <Button color="primary" onClick={() => {
                                    this.connectWC()
                                }}>
                                    Connect with WalletConnect
                                </Button>
                            </div>
                        }
                        {
                            this.state.stage === 1 &&
                            <div>
                                <Button color="primary" onClick={() => {
                                    this.changeVote()
                                }}>
                                    Change Bundler Address
                                </Button>
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Social;