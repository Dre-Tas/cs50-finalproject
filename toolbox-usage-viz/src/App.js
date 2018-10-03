import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarGraph from './components/BarGraph';
import { Jumbotron, Container } from 'reactstrap';

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

                <Jumbotron fluid>
                    <Container fluid>
                        <TotUsageTime pass={this.state.records_lst} />

                        <hr className="my-2" />

                        <TimesUsed pass={this.state.records_lst.length} />
                    </Container>
                </Jumbotron> 

                <br />

                {/* Pass all JSON to graph */}
                {this.state.records_lst.length ? (
                    <BarGraph recs={this.state.records_lst} />
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
            <h3 className="display-5">It has been used {this.props.pass} times!</h3>
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

        return total_usage_time / 1000 / 60 / 60;
    }

    render() {
        var usage_time = this.calcTotalUsageTime();

        return (
            <div>
                <h1 className="display-4">Willow.Design() has saved <strong>{(usage_time).toFixed(2)} hours*</strong> from my latest calculations!</h1>
                <p>Happy days!</p>
                <p>* this right now is not really the time that has been saved,
                    but the time the ttolbox has been running</p>
            </div>
        )
    }
}

export default App;
