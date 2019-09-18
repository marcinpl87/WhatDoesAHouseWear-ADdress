import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';

class ChartComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        new Chart(document.getElementById(this.props.config.id).getContext('2d'), {
            type: 'bar',
            data: this.props.config.data,
            options: {
                title: {
                    display: true,
                    text: this.props.config.title
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }
    render() {
        return (
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <canvas id={this.props.config.id} height="100"></canvas>
                </div>
            </div>
        )
    }
}
export default ChartComponent;
