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
                labels: [
                    this.props.baseline.DeleteUnusedViews.Tool,
                    this.props.baseline.DeleteUnusedViewTemplates.Tool,
                    this.props.baseline["DeleteUnusedFilters"].Tool
                ],
                datasets: [
                    {
                        label: 'Manual',
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        borderColor: 'rgba(128,128,128,0.8)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,128,0,0.6)',
                        hoverBorderColor: 'rgba(128,128,128,1)',
                        data: [
                            this.props.baseline.DeleteUnusedViews.Time,
                            this.props.baseline.DeleteUnusedViewTemplates.Time
                        ]
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

    countToolSizeTime() {
        // Create object by counting cumulative size of all the tools
        // https://stackoverflow.com/questions/29364262/how-to-group-by-and-sum-array-of-object-in-jquery
        var tootlTotSize = [];
        this.props.recs.reduce(function (res, value) {
            if (!res[value.tool]) {
                res[value.tool] = {
                    totSize: 0,
                    tool: value.tool,
                    runTime: 0
                };
                tootlTotSize.push(res[value.tool])
            }
            // Calc mass sum of sizes
            res[value.tool].totSize += value.size
            // Calc mass sum of run times
            let start = new Date(Date.parse(value.start));
            let end = new Date(Date.parse(value.end));
            res[value.tool].runTime += end - start

            return res
        }, {});

        return tootlTotSize;
    }

    getUnitTime(toolName) {
        let toolObj = this.countToolSizeTime().filter(val => val.tool === toolName)[0];
        // Get unit time in seconds
        let unitTime = (toolObj.runTime / toolObj.totSize / 1000).toFixed(3);

        return unitTime;
    }

    setChartData() {
        //Create copy of state object
        var chartDataCP = Object.assign({}, this.state.chartData);

        console.log('a', this.countToolSizeTime());
        // console.log('b', this.countToolSizeTime().filter(val => val.tool === "DeleteUnusedViews"));
        console.log('c', this.getUnitTime("DeleteUnusedViews"))

        chartDataCP.datasets = [
            // Keep first object (Manual) of datasets untouched
            { ...this.state.chartData.datasets[0] },
            {
                // Keep all the values the same
                ...this.state.chartData.datasets[1],
                // Apart from the data...change the data
                data: [
                    this.getUnitTime("DeleteUnusedViews"),
                    this.getUnitTime("DeleteUnusedViewTemplates"),
                    this.getUnitTime("DeleteUnusedFilters")]
            }];

        this.setState({
            chartData: chartDataCP
        })

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

    // filterBy = field => {
    //     var arr = [];
    //     {
    //         this.props.recs.map(function (lst) {
    //             arr.push(lst[field]);
    //         });
    //     }

    //     // Create object that counts occurrencies
    //     var count = _.countBy(arr);

    //     // Sort object to show most used on top
    //     // From: https://stackoverflow.com/questions/32349838/lodash-sorting-object-by-values-without-losing-the-key
    //     var sorted = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse())

    //     //Create copy of state object
    //     var chartDataCP = Object.assign({}, this.state.chartData);

    //     // Update values
    //     chartDataCP.labels = Object.keys(sorted);
    //     chartDataCP.datasets = [{
    //         // Keep all the values the same
    //         ...this.state.chartData.datasets[0],
    //         // Apart from the data...change the data
    //         data: Object.values(sorted)
    //     }];

    //     // Update state to updated values
    //     this.setState({
    //         chartData: chartDataCP
    //     })
    // }

    // filtDate = () => {
    //     var starts = [];
    //     {
    //         this.props.recs.map(function (lst) {
    //             starts.push(new Date(lst['start']).toISOString().split('T')[0]);
    //         });
    //     }

    //     var count = _.countBy(starts);

    //     var sorted = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse())

    //     //Create copy of state object
    //     var chartDataCP = Object.assign({}, this.state.chartData);

    //     // Update values
    //     chartDataCP.labels = Object.keys(sorted);
    //     chartDataCP.datasets = [{
    //         // Keep all the values the same
    //         ...this.state.chartData.datasets[0],
    //         // Apart from the data...change the data
    //         data: Object.values(sorted)
    //     }];

    //     // Update state to updated values
    //     this.setState({
    //         chartData: chartDataCP
    //     })
    // }

    // filtMonth = () => {
    //     var starts = [];
    //     {
    //         this.props.recs.map(function (lst) {
    //             starts.push(new Date(lst['start']).toISOString().split('-')[1]);
    //         });
    //     }

    //     var count = _.countBy(starts);

    //     var sorted = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse())

    //     //Create copy of state object
    //     var chartDataCP = Object.assign({}, this.state.chartData);

    //     // Months
    //     const monthNames = ["January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"
    //     ];

    //     // Variable to hold the translation between month's number and name
    //     var months = [];

    //     // Date's number to month name
    //     (Object.keys(sorted)).forEach(function (el) {
    //         months.push(monthNames[(parseInt(el) - 1)]);
    //     });

    //     // Update values
    //     chartDataCP.labels = months;
    //     chartDataCP.datasets = [{
    //         // Keep all the values the same
    //         ...this.state.chartData.datasets[0],
    //         // Apart from the data...change the data
    //         data: Object.values(sorted)
    //     }];

    //     // Update state to updated values
    //     this.setState({
    //         chartData: chartDataCP
    //     })
    // }

    render() {
        // console.log('props', this.props.baseline)
        return (
            <div className="chart">

                {/* <ButtonGroup>
                    <Button outline color="secondary" onClick={() => this.filterBy('revitversion')}>
                        By version</Button>
                    <Button outline color="secondary" onClick={() => this.filterBy('tool')}>
                        By tool</Button>
                    <Button outline color="secondary" onClick={() => this.filterBy('user')}>
                        By user</Button>
                    <Button outline color="secondary" onClick={this.filtDate}>
                        By date</Button>
                    <Button outline color="secondary" onClick={this.filtMonth}>
                        By month</Button>
                </ButtonGroup> */}


                <Bar
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
                                barPercentage: 0.5

                            }],
                            yAxes: [{
                                type: 'logarithmic',
                                ticks: {
                                    autoSkip: true,
                                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                    suggestedMax: this.props.recs.length,
                                    // https://stackoverflow.com/questions/50968672/how-to-create-a-custom-logarithmic-axis-in-chart-js
                                    callback: function (value) {
                                        if (value == 1 ||
                                            value == 2 ||
                                            value == 3 ||
                                            value == 4 ||
                                            value == 5 ||
                                            value == 10 ||
                                            value == 20) {
                                            return value;
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
