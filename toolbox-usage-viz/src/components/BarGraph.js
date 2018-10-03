import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';
import _ from 'lodash';

class BarGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['Toolbox (whole)'],
                datasets: [
                    {
                        label: 'number of uses',
                        backgroundColor: 'rgba(255,128,0,0.3)',
                        borderColor: 'rgba(128,128,128,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,128,0,0.6)',
                        hoverBorderColor: 'rgba(128,128,128,1)',
                        data: [this.props.recs.length]
                    }
                ]
            }
        }
    }

    static defaultProps = {
        // You can override these props if you set them from the App
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'bottom',
        fontSize: 20,
        width: 100,
        height: 50,
    }

    filterBy = field => {
        var arr = [];
        {
            this.props.recs.map(function (lst) {
                arr.push(lst[field]);
            });
        }

        // Create object that counts occurrencies
        var count = _.countBy(arr);

        // Sort object to show most used on top
        // From: https://stackoverflow.com/questions/32349838/lodash-sorting-object-by-values-without-losing-the-key
        var sorted = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse())

        //Create copy of state object
        var chartDataCP = Object.assign({}, this.state.chartData);

        // Update values
        chartDataCP.labels = Object.keys(sorted);
        chartDataCP.datasets = [{
            // Keep all the values the same
            ...this.state.chartData.datasets[0],
            // Apart from the data...change the data
            data: Object.values(sorted)
        }];

        // Update state to updated values
        this.setState({
            chartData: chartDataCP
        })
    }

    render() {
        return (
            <div className="chart">
                <HorizontalBar
                    data={this.state.chartData}
                    width={this.props.width}
                    height={this.props.height}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: 'How many times has the toolbox been used?',
                            fontSize: this.props.fontSize
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                    suggestedMax: this.props.recs.length,
                                }
                            }],
                            yAxes: [{
                                barPercentage: 0.5
                            }]
                        }
                    }}
                />

                {/* <VersionsButton pass={this.props.recs} /> */}

                <button onClick={()=>this.filterBy('revitversion')}>By version</button>
                <button onClick={()=>this.filterBy('tool')}>By tool</button>
                <button onClick={()=>this.filterBy('user')}>By user</button>

            </div>
        )
    }
}

// class VersionsButton extends Component {
//     constructor(props) {
//         super(props);
//     }

//     getVersions() {
//         var versions = new Set([]);

//         {
//             this.props.pass.map(function (lst) {
//                 versions.add(lst.revitversion)
//             })
//         }
//         return versions;
//     }

//     splitVers() {
//         var arrVers = [];
//         {
//             this.props.pass.map(function (lst, i) {
//                 arrVers.push(lst.revitversion);
//             });
//         }

//         var count = _.countBy(arrVers);

//         this.setState({
//             chartData: {
//                 labels: Object.keys(count),
//                 datasets: [{ data: Object.values(count) }]
//             }
//         })
//     }

//     render() {
//         return (
//             <div>
//                 <button onClick={this.splitVers()}>Split by version</button>

//                 <ul>
//                     {Array.from(this.getVersions()).map(function (lst, i) {
//                         return <li key={i}>{lst}</li>
//                     })}
//                 </ul>
//             </div>
//         )
//     }
// }


export default BarGraph;
