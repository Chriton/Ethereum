import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery.js';

/**
 https://stackoverflow.com/questions/55841962/create-react-app-creating-app-js-without-component-after-update
 https://www.npmjs.com/package/create-react-app
 create-react-app latest version uses function and not class as it is shown in the course.
 We can either install a version prior to that (like 2.1.8) and do the "create-react-app lottery-react" command again,
 or just modify the code like this to use class
**/

class App extends Component {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);

    state = {
        manager: '',
        players: [],
        balance: '',
        value: ''
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ manager, players, balance });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
    };


    render(){
        return (
            <div>
            <h2>Lottery Contract</h2>
            <p>
                This contract is managed by { this.state.manager }.
                There are currently {this.state.players.length} people entered,
                competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
            </p>
            <hr />
            <form onSubmit={this.onSubmit}>
                <h4>Want to try your luck?</h4>
                <div>
                    <label>Amount of ether to enter</label>
                    <input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                    />
                </div>
                <button>Enter</button>

            </form>

            </div>
        );
    }
}

export default App;
