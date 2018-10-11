import React, { Component } from 'react';
import { defaults } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';
import moment from 'moment';
import _ from 'lodash';
import { Button, ButtonGroup } from 'reactstrap';

defaults.global.defaultFontFamily = 'CircularStd'

class UsageHBarGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: ['Toolbox (whole)'],
                datasets: [
                    {
                        label: 'number of uses',
                        backgroundColor: 'rgba(255,128,0,0.3)',
                        borderColor: 'rgba(128,128,128,0.8)',
                        borderWidth: 2,
                        hoverBackgroundColor: 'rgba(255,128,0,0.6)',
                        hoverBorderColor: 'rgba(128,128,128,1)',
                        data: [this.props.recs.length]
                    }
                ]
            },
            
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

    filtDate = () => {
        var starts = [];
        {
            this.props.recs.map(function (lst) {
                starts.push(new Date(lst['start']).toISOString().split('T')[0]);
            });
        }

        var count = _.countBy(starts);

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

    filtMonth = () => {
        var starts = [];
        {
            this.props.recs.map(function (lst) {
                starts.push(new Date(lst['start']).toISOString().split('-')[1]);
            });
        }

        var count = _.countBy(starts);

        var sorted = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse())

        //Create copy of state object
        var chartDataCP = Object.assign({}, this.state.chartData);

        // Months
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Variable to hold the translation between month's number and name
        var months = [];

        // Date's number to month name
        (Object.keys(sorted)).forEach(function (el) {
            months.push(monthNames[(parseInt(el) - 1)]);
        });

        // Update values
        chartDataCP.labels = months;
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

export default UsageHBarGraph;
