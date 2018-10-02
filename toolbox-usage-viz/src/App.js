import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarGraph from './components/BarGraph';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

class App extends Component {
    constructor() {
        super();
        this.state = {
            records_lst: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let data = fetch('http://127.0.0.1:5000/api/dbrecords')
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    records_lst: data,
                })
            });
    }

    render() {
        var versions = new Set([]);

        return (
            <div className="App">

                <TimesUsed pass={this.state.records_lst.length} />

                <TotUsageTime pass={this.state.records_lst} />

                <br />

                {/* Pass all JSON to graph */}
                {this.state.records_lst.length ? (
                    <BarGraph culo={this.state.records_lst} />
                ) : (
                        "Fetching Data from server..."
                    )}

            </div>);
    }
}

class TimesUsed extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h2>Willow.Design() has been used {this.props.pass} times!</h2>
        );
    }
}

class TotUsageTime extends Component {
    constructor(props) {
        super(props);
    }

    calcTotalUsageTime() {
        // Calculates the time in milliseconds
        let total_usage_time = 0;

        {
            this.props.pass.map(function (lst, i) {
                let start = new Date(Date.parse(lst.start));
                let end = new Date(Date.parse(lst.end));
                total_usage_time += end - start
            })
        };

        return total_usage_time / 1000;
    }

    render() {
        var usage_time = this.calcTotalUsageTime();

        return (
            <div>
                <h1>For a total run time of {usage_time.toFixed(2)} seconds...</h1>
                <h3>or {(usage_time / 60 / 60).toFixed(2)} hours...</h3>
            </div>
        )
    }
}

export default App;
