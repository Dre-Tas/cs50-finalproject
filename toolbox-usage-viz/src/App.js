import React, { Component } from 'react';
import './App.css';
import UsageHBarGraph from './components/HBarGraph';
import TimeVBarGraph from './components/GBarGraph';
import { Jumbotron, Container, Badge } from 'reactstrap';
import { BarLoader } from 'react-css-loaders';
import man_proc from './ManualProcess.json';

class App extends Component {
    constructor() {
        super();
        this.state = {
            records_lst: [],
            man_process: man_proc,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch('http://127.0.0.1:5000/api/dbrecords')
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    records_lst: data,
                })
            });
    }

    render() {
        return (
            <div className="App">
                <Jumbotron fluid>
                    <Container className="container" fluid>
                        <TotUsageTime pass={this.state.records_lst} />

                        <hr className="my-2" />

                        <TimesUsed pass={this.state.records_lst.length} />
                    </Container>
                </Jumbotron>

                {this.state.records_lst.length ? (
                    <TimeVBarGraph recs={this.state.records_lst} baseline={this.state.man_process} />
                ) : (
                        "Fetching Data from server..."
                    )}


                {/* Pass all JSON to graph */}
                {this.state.records_lst.length ? (
                    <UsageHBarGraph recs={this.state.records_lst} />
                ) : (
                        <BarLoader />
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
                <h1 className="display-4">Willow.Design()
                has saved <Badge color="info" pill>{(usage_time).toFixed(2)} hours</Badge>
                    * from my latest calculations!</h1>
                <p>Happy days!</p>
                <p>* this right now is not really the time that has been saved,
                    but the time the toolbox has been running</p>
            </div>
        )
    }
}

export default App;
