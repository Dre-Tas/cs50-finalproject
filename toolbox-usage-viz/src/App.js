import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import {HorizontalBar} from 'react-chartjs-2';
import _ from 'lodash';

class App extends Component {
    constructor() {
        super();
        this.state = {
            records_lst : [],
        }
        this.fetchData();
    }

    fetchData() {
        let data = fetch('http://127.0.0.1:5000/api/dbrecords')
            .then((resp) => {
                resp.json().then((res) => {
                    this.setState({records_lst : res});
                });
            })
    }

    calcTotalUsageTime() {
        // Calculates the time in milliseconds
        let total_usage_time = 0;

        {this.state.records_lst.map(function(lst, i) {
            let start = new Date(Date.parse(lst.start));
            let end = new Date(Date.parse(lst.end));
            total_usage_time += end - start
        })};

        return total_usage_time / 1000;
    }

    render() {
        var usage_time = this.calcTotalUsageTime()

        var versions = new Set([]);

        return (<div className="App">
            <h2>Willow.Design() has been used {this.state.records_lst.length} times!</h2>
            <br></br>
            <h1>For a total run time of {usage_time.toFixed(2)} seconds...</h1>
            <h3>or {(usage_time / 60 / 60).toFixed(2)} hours...</h3>

            {this.state.records_lst.map(function(lst, i) {
                versions.add(lst.revitversion)
            })}

            {Array.from(versions).map(function(lst, i) {
                return <p key={i}>{lst}</p>
            })}

            {/* <HBarGraph records={records}/> */}
        </div>);
    }
}

export default App;

class HorBarG extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a : []
        };
    }


}

const HBarGraph = (props) => {
    const data = {
      labels: ['2018', '2017'],
      datasets: [
        {
          label: 'Which version is more popular?',
          backgroundColor: 'rgba(255,153,0,0.2)',
          borderColor: 'rgba(255,153,0,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: [65, 59]
        }
      ]
    };

    return (
        <HorizontalBar data={data}/>
    )
}
