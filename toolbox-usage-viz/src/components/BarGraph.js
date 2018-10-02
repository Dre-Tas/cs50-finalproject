import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class BarGraph extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     chartData: {
        //         labels: [this.props.label1],
        //         datasets: [
        //             {
        //                 label: [this.props.label2],
        //                 backgroundColor: 'rgba(255,99,132,0.2)',
        //                 borderColor: 'rgba(255,99,132,1)',
        //                 borderWidth: 1,
        //                 hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        //                 hoverBorderColor: 'rgba(255,99,132,1)',
        //                 data: [this.props.countUsed]
        //             }
        //         ]
        //     }
        // }
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

    render() {
        return (
            <div className="chart">
                <Bar
                    data={{
                        labels: ['toolbox'],
                        datasets: [
                            {
                                label: [this.props.label2],
                                backgroundColor: 'rgba(255,99,132,0.2)',
                                borderColor: 'rgba(255,99,132,1)',
                                borderWidth: 1,
                                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                                hoverBorderColor: 'rgba(255,99,132,1)',
                                data: [this.props.culo.length]
                            }
                        ]
                    }}
                    width={this.props.width}
                    height={this.props.height}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: 'just a test', // This comes from App
                            fontSize: this.props.fontSize
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        }
                    }}
                />

                <VersionsButton pass={this.props.culo} />

            </div>
        )
    }
}

class VersionsButton extends Component {
    constructor(props) {
        super(props);
    }

    getVersions() {
        var versions = new Set([]);

        {
            this.props.pass.map(function (lst, i) {
                versions.add(lst.revitversion)
            })
        }
        return versions;
    }

    splitVers() {

    }

    render() {
        return (
            <div>
                <button onClick={this.splitVers()}>Split by version</button>

                <ul>
                    {Array.from(this.getVersions()).map(function (lst, i) {
                        return <li key={i}>{lst}</li>
                    })}
                </ul>
            </div>

        )
    }
}


export default BarGraph;
