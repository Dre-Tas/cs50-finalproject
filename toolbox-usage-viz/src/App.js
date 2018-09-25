import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {data: null}
        this.getData();
    }

    getData() {
        let data = fetch('http://127.0.0.1:5000/countrow')
            .then((resp) => {
                resp.json().then((res) => {
                    console.log(res.data);
                    this.setState({data: res.data});
                });
            })
    }

    render() {
        return (<div className="App">
            <h1>{this.state.data}</h1>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit
                <code>src/App.js</code>
                and save to reload.
            </p>
        </div>);
    }
}

export default App;
