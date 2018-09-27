import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import _ from 'lodash';

class App extends Component {
    constructor() {
        super();
        this.state = {
            records_lst : [],
        }
        this.getData();
    }

    getData() {
        let data = fetch('http://127.0.0.1:5000/api/dbrecords')
            .then((resp) => {
                resp.json().then((res) => {
                    this.setState({records_lst : res});
                });
            })
    }

    render() {
        let total_usage_time = 0;
        return (<div className="App">
            {this.state.records_lst.map(function(lst, i) {
                let start = new Date(Date.parse(lst.start));
                let end = new Date(Date.parse(lst.end));
                total_usage_time += end - start
                // return <p key={i}>{moment(start).format("DD/MM/YYYY")}</p>
            })}
            <h2>Willow.Design() has been used {this.state.records_lst.length} times!</h2>
            <br></br>
            <h1>For a total run time of {total_usage_time} milliseconds...</h1>
            <h2>or {total_usage_time / 1000} seconds...</h2>
            <h3>or {total_usage_time / 1000 / 60} minutes...</h3>
            <h4>or {total_usage_time / 1000 / 60 / 60} hours...</h4>
            <h5>or {total_usage_time / 1000 / 60 / 60 / 60} days...</h5>
        </div>);
    }
}

export default App;
