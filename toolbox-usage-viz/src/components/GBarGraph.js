import React, { Component } from 'react';
import { defaults } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import _ from 'lodash';
import { Button, ButtonGroup } from 'reactstrap';

defaults.global.defaultFontFamily = 'CircularStd'

class TimeVBarGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Manual',
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        borderColor: 'rgba(128,128,128,0.8)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,128,0,0.6)',
                        hoverBorderColor: 'rgba(128,128,128,1)',
                        data: []
                    },
                    {
                        label: 'Toolbox',
                        backgroundColor: 'rgba(255,128,0,0.3)',
                        borderColor: 'rgba(128,128,128,0.8)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,128,0,0.6)',
                        hoverBorderColor: 'rgba(128,128,128,1)',
                        data: []
                    },
                ]
            },

        }
    }

    componentDidMount() {
        this.setChartData();
    }

    getAutoUnitTime(toolCode) {
        // Get the object - better readability
        let toolObj = this.props.recs.filter(val => val.tool === toolCode)[0];
        // Get unit time in seconds
        if (typeof (toolObj) !== "undefined") {
            let unitTime = (toolObj.runTime / toolObj.totSize / 1000).toFixed(3);
            return unitTime;
        }
    }

    getManUnitTime(toolCode) {
        // Get the object - better readability
        let toolObj = this.props.baseline[toolCode];

        if (typeof (toolObj) !== "undefined") {
            return toolObj.Time / toolObj.Size;
        }
    }

    getToolName(toolCode) {
        let toolObj = this.props.baseline[toolCode];

        if (typeof (toolObj) !== "undefined") {
            return toolObj.Tool
        }
    }

    setChartData() {
        let arrCodesAuto = [];
        this.props.recs.map(obj =>arrCodesAuto.push(obj.tool))

        let arrCodesMan = Object.keys(this.props.baseline)

        // Get only elements that are in both arrays
        // it wouldn't make sense to compare tools that haven't been tested or used
        let intersection = _.intersection(arrCodesAuto, arrCodesMan)
        // Which tools have never been used?
        let difference = _.difference(arrCodesAuto, arrCodesMan)

        let labelNames = [];
        intersection.map(code => labelNames.push(this.getToolName(code)))

        var manTimes = [];
        intersection.map(code => manTimes.push(this.getManUnitTime(code)))

        var autoTimes = [];
        intersection.map(code => autoTimes.push(this.getAutoUnitTime(code)))

        var cDataCopy = { ...this.state.chartData };
        cDataCopy.labels = labelNames.filter(Boolean);
        cDataCopy.datasets[{ ...this.state.chartData.datasets[0] }];
        cDataCopy.datasets[0].data = manTimes.filter(Boolean);
        cDataCopy.datasets[{ ...this.state.chartData.datasets[1] }];
        cDataCopy.datasets[1].data = autoTimes.filter(Boolean);
        this.setState({ chartData: cDataCopy })
    }

    static defaultProps = {
        // You can override these props if you set them from the App
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'bottom',
        fontSize: 20,
        width: window.innerWidth,
        height: window.innerHeight * 0.9,
    }


    render() {
        return (
            <div className="chart">
                <Bar
                    data={this.state.chartData}
                    width={this.props.width}
                    height={this.props.height}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: this.props.displayTitle,
                            text: 'How much time is the toolbox saving?',
                            fontSize: this.props.fontSize
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        },
                        scales: {

                            xAxes: [{
                                barPercentage: 0.5,
                                ticks: {
                                    minRotation: 90
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: "Run Time (logarithmic scale)",
                                },
                                type: 'logarithmic',
                                ticks: {
                                    autoSkip: true,
                                    min: 0,    // minimum will be 0, unless there is a lower value.
                                    suggestedMax: 500,
                                    // https://stackoverflow.com/questions/50968672/how-to-create-a-custom-logarithmic-axis-in-chart-js
                                    callback: function (value) {
                                        if (value === 1 ||
                                            value === 2 ||
                                            value === 3 ||
                                            value === 4 ||
                                            value === 5 ||
                                            value === 10 ||
                                            value === 50 ||
                                            value === 100 ||
                                            value === 250 ||
                                            value === 500) {
                                            return value + " sec";
                                        }
                                    }
                                }

                            }]
                        },
                        animation: {
                            easing: 'easeOutCubic'
                        },
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 0,
                                bottom: 10
                            }
                        }
                    }}
                />
            </div>
        )
    }
}

export default TimeVBarGraph;
