import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import _ from 'lodash';

class BarGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['toolbox'],
                datasets: [
                    {
                        // label: ['# of uses'],
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [this.props.recs.length]
                    }
                ]
            }
        }
    }

    static defaultProps = {
        // You can override these props if you set them from the App
        displayTitle: true,
        // displayLegend: true,
        legendPosition: 'bottom',
        fontSize: 20,
        width: 100,
        height: 50,
    }

    byVersion = () => {
        var arrVers = [];
        {
            this.props.recs.map(function (lst, i) {
                arrVers.push(lst.revitversion);
            });
        }

        var count = _.countBy(arrVers);

        this.setState({
            chartData: {
                labels: Object.keys(count),
                datasets: [{ data: Object.values(count) }]
            }
        })
    }


    render() {
        return (
            <div className="chart">
                <Bar
                    data={this.state.chartData}
                    width={this.props.width}
                    height={this.props.height}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: 'How many times has it been used?',
                            fontSize: this.props.fontSize
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        },
                        scales: {
                            yAxes: [{
                                display: true,
                                ticks: {
                                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                    suggestedMax: this.props.recs.length,
                                }
                            }],
                            xAxes: [{
                                // barThickness : 150
                                barPercentage: 0.5
                            }]
                        }
                    }}
                />

                {/* <VersionsButton pass={this.props.recs} /> */}

                <button onClick={this.byVersion}>By version</button>

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
