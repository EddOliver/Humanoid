import { width } from '@mui/system';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';

class Main extends Component {
    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop:"12%" }}>
                <Card style={{width:window.innerWidth * 0.3}}>
                    <CardHeader style={{textAlign:"center", fontSize:"1.5rem"}}>
                        Humanoid Wallet
                    </CardHeader>
                    <CardBody>
                        <div style={{ margin: "20px 0px" ,textAlign:"center"}}>
                            <Button style={{width:window.innerWidth * 0.16, height:window.innerHeight * 0.08}} size='lg' color="primary" onClick={() => window.open("/login")}>
                                Login
                            </Button>
                        </div>
                    </CardBody>
                    <CardBody>
                        <div style={{ margin: "20px 0px" ,textAlign:"center"}}>
                            <Button style={{width:window.innerWidth * 0.16, height:window.innerHeight * 0.08}} size='lg' color="primary" onClick={() => window.open("/create")}>
                                Create
                            </Button>
                        </div>
                    </CardBody>
                    <CardBody>
                        <div style={{ margin: "20px 0px" ,textAlign:"center"}}>
                            <Button style={{width:window.innerWidth * 0.16, height:window.innerHeight * 0.08}} size='lg' color="primary" onClick={() => window.open("/recover")}>
                                Recover
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Main;