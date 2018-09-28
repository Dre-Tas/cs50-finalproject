import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class BarGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData : {
                labels: [this.props.label1],
                datasets: [
                    {
                        label: [this.props.label2],
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [this.props.countUsed]
                    }
                ]
            }
        }
    }

    static defaultProps = {
        // You can override these props if you set them from the App
        displayTitle : true,
        displayLegend : true,
        legendPosition : 'bottom',
        fontSize : 20
    }

    render() {
        return(
            <div className="chart">
            <Bar
                data={this.state.chartData}
                width={100}
                height={50}
                options={{
                    title : {
                        display : this.props.displayTitle,
                        text : this.props.textTitle, // This comes from App
                        fontSize : this.props.fontSize
                    },
                    legend : {
                        display : this.props.displayLegend,
                        position : this.props.legendPosition
                    }
                }}
            />
            </div>
        )
    }
}

export default BarGraph;
