import React, { Component } from 'react';
import './App.css';
import UsageHBarGraph from './components/HBarGraph';
import TimeVBarGraph from './components/GBarGraph';
import { Jumbotron, Container, Badge, Row, Col, Button, ButtonGroup } from 'reactstrap';
import { BarLoader } from 'react-css-loaders';
import moment from 'moment';

class App extends Component {
    constructor() {
        super();
        this.state = {
            summary: [],
            show_graph: true,
            graph_tb: [],
            unitsavingAuto: [],
        };
    }

    // Initial setup
    componentDidMount() {
        this.fetchSummary();
        this.fetchUnitSavings();
        this.fetchGraphToolbox();
    }

    // Fetch APIs
    fetchSummary() {
        fetch('http://127.0.0.1:5000/api/summary')
            .then(response => response.json())
            .then((smr) => {
                this.setState({
                    summary: smr,
                })
            });
    }

    fetchUnitSavings() {
        fetch('http://127.0.0.1:5000/api/unitsaving')
            .then(response => response.json())
            .then((auto) => {
                this.setState({
                    unitsavingAuto: auto,
                })
            });
    }

    fetchGraphToolbox() {
        fetch('http://127.0.0.1:5000/api/graphtoolbox')
            .then(response => response.json())
            .then((tbdata) => {
                this.setState({
                    show_graph: true,
                    graph_tb: tbdata,
                })
            });
    }

    fetchGraphVersion() {
        fetch('http://127.0.0.1:5000/api/graphversion')
            .then(response => response.json())
            .then((versdata) => {
                this.setState({
                    show_graph: true,
                    graph_tb: versdata,
                })
            });
    }

    fetchGraphTool() {
        fetch('http://127.0.0.1:5000/api/graphtool')
            .then(response => response.json())
            .then((tooldata) => {
                this.setState({
                    show_graph: true,
                    graph_tb: tooldata,
                })
            });
    }

    fetchGraphUser() {
        fetch('http://127.0.0.1:5000/api/graphuser')
            .then(response => response.json())
            .then((userdata) => {
                this.setState({
                    show_graph: true,
                    graph_tb: userdata,
                })
            });
    }

    rst() {
        this.setState({
            show_graph: false
        })
    }

    radio(i) {
        this.setState({ radio: i });
    }

    render() {
        return (
            <div className="App">
                <Jumbotron fluid>
                    <Container className="container" fluid>
                        {this.state.summary.length ? (
                            <TotUsageTime sum={this.state.summary[0]} />
                        ) : (
                                <BarLoader />
                            )}

                        <hr className="my-2" />

                        {this.state.summary.length ? (
                            <TimesUsed sumtimes={this.state.summary[0].totused} />
                        ) : (
                                <BarLoader />
                            )}
                    </Container>
                </Jumbotron>

                <h3> How much time is each tool saving every time? </h3>
                {this.state.unitsavingAuto.length ? (
                    <TimeVBarGraph recs={this.state.unitsavingAuto} />
                ) : (
                        <BarLoader />
                    )}

                <hr className="my-2" />

                <h3> How many times has the toolbox been used? On how many elements? </h3>

                <ButtonGroup>
                    <Button outline color="secondary" onClick={() => { this.rst(); this.fetchGraphTool(); this.radio(1)}} active={this.state.radio === 1}>
                        By Tool</Button>
                    <Button outline color="secondary" onClick={() => { this.rst(); this.fetchGraphVersion(); this.radio(2)}} active={this.state.radio === 2}>
                        By Version</Button>
                    <Button outline color="secondary" onClick={() => { this.rst(); this.fetchGraphUser(); this.radio(3) }} active={this.state.radio === 3}>
                        By User</Button>
                    <Button outline color="secondary" onClick={() => { this.rst(); this.fetchGraphToolbox(); this.radio(4) }} active={this.state.radio === 4}>
                        Total</Button>
                </ButtonGroup>

                <Container fluid>
                    {this.state.show_graph ? (
                        <Row>
                            <Col>
                                {this.state.graph_tb.length ? (
                                    <UsageHBarGraph datasets={this.state.graph_tb[0].totused}
                                        labels={this.state.graph_tb[0].labels} />
                                ) : (
                                        <BarLoader />
                                    )}
                            </Col>
                            <Col>
                                {this.state.graph_tb.length ? (
                                    <UsageHBarGraph datasets={this.state.graph_tb[0].totsize}
                                        labels={this.state.graph_tb[0].labels} />
                                ) : (
                                        <BarLoader />
                                    )}
                            </Col>
                            <Col>
                                {this.state.graph_tb.length ? (
                                    <UsageHBarGraph datasets={this.state.graph_tb[0].totsaved}
                                        labels={this.state.graph_tb[0].labels} />
                                ) : (
                                        <BarLoader />
                                    )}
                            </Col>
                        </Row>
                    ) : (
                            <BarLoader />
                        )}
                </Container>
            </div>);
    }
}

// Break into classes - better readability

class TimesUsed extends Component {
    render() {
        return (
            <h3 className="display-5">It has been used {this.props.sumtimes} times!</h3>
        );
    }
}

class TotUsageTime extends Component {
    render() {
        return (
            <div>
                <h1 className="display-4">The Revit Toolbox
                has saved <Badge color="info" pill>
                        {(this.props.sum.totsaved / 3600).toFixed(1)} hours
                </Badge> since {moment.utc(this.props.sum.first).format("LL")}</h1>
            </div>
        )
    }
}

export default App;
