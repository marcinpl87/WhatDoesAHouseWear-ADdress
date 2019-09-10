import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';

class ChartComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <canvas id={this.props.chartId} height="100"></canvas>
                </div>
            </div>
        )
    }
}
export default ChartComponent;
