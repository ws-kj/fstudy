import {Table, Container, Button, Form} from 'react-bootstrap';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3.js'
import ipfs from './ipfs';
import storehash from './storehash';

class Guide extends Component {
    state = {
        title:'Chinese to English Unit 1',
        cards:{"Wo":"Me", "Ni":"You", "Hao":"Good"},
    };

    pack = () => {
        let j = {};
        j[this.state.title] = this.state.cards;
        return(Buffer.from(JSON.stringify(j)));
    }

    unpack = (buf) => {
        let json = JSON.parse(buf.toString());
        for(const p in json) {
            this.state.title = p;
            this.state.cards = json[p];
        }
    }

    render() {
        const items = Object.entries(this.state.cards).map(([f, b]) =>
            <Card front={f} back={b}/>
        );
        return (
            <div className="guide">
                <p>{this.state.title}</p>
                {items}
            </div>
        );
    }
}

class Card extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-face">
                    <p>{this.props.front}</p>
                </div>
                <div className="card-face">
                    <p>{this.props.back}</p>
                </div>
            </div>
        );
    }
}

export default class App extends Component {
    state = {
        guide:null,
        ipfsHash:null,
        buffer:'',
        guideBuffer:'',
        title:'',
        ethAddress:'',
        blockNumber:'',
        transactionHash:'',
        gasUsed:'',
        txReceipt:''
    };
    
    setTitle = (event) => {
        this.setState({title: event.target.value});
    };

    convertToBuffer = async(reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
    };

    onClick = async () => {
        try {
            this.setState({blockNumber:"waiting..."});
            this.setState({gasUsed:"waiting..."});
            await web3.eth.getTransactionReceipt(this.state.transactionHash, (txReceipt)  =>{
                console.log(txReceipt);
                this.setState({txReceipt});
                });
            await this.setState({blockNumber: this.state.txReceipt.blockNumber});
            await this.setState({gasUsed: this.statetxReceipt.gasUsed}); 
        } catch (error) {
            console.log(error);
        }
    };

    onSubmit = async (event) => {
        event.preventDefault();
/*        
        //test
        web3.eth.getAccounts(console.log)

        const accounts = await web3.eth.getAccounts()

        console.log('Sending from Metamask account ' + accounts[0]);
        */
        const ethAddress = await storehash.options.address;
        this.setState({ethAddress});

        this.setState({guide:new Guide()});
        this.setState({buffer:this.state.guide.pack()});
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err,ipfsHash);
            this.setState({ ipfsHash:ipfsHash[0].hash });

            storehash.methods.sendGuide(this.state.title, this.state.ipfsHash).send(
            {from: null}, (error, transactionHash) => {
                console.log(transactionHash);
                this.setState({transactionHash});
            });
        })
    };

    loadGuide = (guide) => {

    }

    render() {
        return (

<div className="App">
    <Container>
        <h3>Upload Guide</h3>
        <Form onSubmit={this.onSubmit}>
            <input
                type = "text"
                value = {this.state.Title} 
                onChange = {this.setTitle}
            />
            
            <Button bsStyle="primary" type="submit">
                Upload!
            </Button>
        </Form>
        <hr />
        <Button onClick = {this.onClick}>Get Receipt</Button>
        <Table bordered responsive>
            <thead>
                <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Link</td>
                    <td>https://gateway.ipfs.io/ipfs/{this.state.ipfsHash}</td>
                </tr>
                <tr>
                    <td>IPFS Hash # on Contract</td>
                    <td>{this.state.ipfsHash}</td>
                </tr>
                <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                </tr>
                <tr>
                    <td>Tx Hash # </td>
                    <td>{this.state.transactionHash}</td>
                </tr>
                <tr>
                    <td>Block #</td>
                    <td>{this.state.blockNumber}</td>
                </tr>
                <tr>
                    <td>Gas Used</td>
                    <td>{this.state.gasUsed}</td>
                </tr>
            </tbody>
        </Table>
    <Guide/>
    </Container>
</div>

        );
    };
}
