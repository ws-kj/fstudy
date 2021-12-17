import {Table, Container, Button, Form} from 'react-bootstrap';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import web3 from './web3.js'
import ipfs from './ipfs';
//import storehash from './storehash';

class Guide extends Component {
    state = {
        title:'',
        cards:{},
    };

    pack = () => {
        let j = {};
        j[this.state.title] = this.state.cards;
        console.log(JSON.stringify(j));
        return(Buffer.from(JSON.stringify(j)));
        
    }

    unpack = (buf) => {
        let json = JSON.parse(buf.toString());
        for(const p in json) {
            this.setState({title: p});
            this.setState({cards: json[p]});
        }
    }

    populate = (t,c) => {
        this.setState({title: t});
        this.setState({cards: c});
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

class GuideForm extends Component {
    state = {
        title: '',
        idCards: [],     
        ipfsHash: ''
    };

    setTitle = (event) => {
        this.setState({title: event.target.value});
    };

    createCard = () => {
        let obj = {
            front: '',
            back: ''
        };
        this.state.idCards.push(obj);
        this.setState({idCards: this.state.idCards});
    }

    genGuide = async (event) => {
        event.preventDefault();

        let j = {};
        j[this.state.title] = this.state.idCards;
        console.log(JSON.stringify(j));
        let buffer = Buffer.from(JSON.stringify(j));
		this.createApi(buffer);
    }
   
	createApi = async (buf) => {
				let api = '/api/create/' + buf;
				console.log(api);
				let r = fetch(api)
					.then(response => response.json())
					.then(data => {
						let hash = JSON.parse(data)['hash'];
						window.location.assign("/guides/" + hash);
					});
//					.then(data => window.location.assign("/guides/" + data['hash']));
	}

    handleChange = (cid, pos) => (event) => {
        if(pos == 0) {
            this.state.idCards[cid].front = event.target.value;
        } else {
            this.state.idCards[cid].back = event.target.value;
        }
        this.setState({...this.state, idCards: this.state.idCards});
    }

    render() {
        const items = this.state.idCards.map((c, i) =>
            <div className="card">
                <div className="card-face">
                    <input
                        type="text"
                        value={i[0]}
                        onChange={this.handleChange(i, 0)}
                     />
               </div>
                <div className="card-face">
                    <input
                        type="text"
                        value={i[1]}
                        onChange={this.handleChange(i, 1)}
                    />
                </div>
            </div>
        );

        return (
           <div className="guide">
                <Form onSubmit={this.genGuide}>
                    <input 
                        type="text"
                        value={this.state.title}
                        onChange={this.setTitle}
                    />
                    <>{items}</>
                    <Button variant="secondary" onClick={this.createCard}>
                        Create Card
                    </Button>
                    <Button variant="primary" type="submit">
                        Create Guide
                    </Button>
                </Form>
            </div>
        );
    };
}

export default class App extends Component {
    state = {
        eguide:<GuideForm/>,
        guide:null,
    };
    

    render() {
        return (

<div className="App">
    <Container>
        <>{this.state.eguide}</>
        <hr />
        <Guide/>
    </Container>
</div>

        );
    };
}
