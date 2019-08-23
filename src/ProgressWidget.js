import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

class ProgressWidget extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var progressStyle = {width: this.props.widgetData.percentage+"%"}
        return (
            <div className="main-card mb-3 card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="widget-content p-0">
                            <div className="widget-content-outer">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left">
                                        <div className="widget-heading">{this.props.widgetData.title}</div>
                                        <div className="widget-subheading" dangerouslySetInnerHTML={{
                                            __html: this.props.widgetData.subTitle ? this.props.widgetData.subTitle : "&nbsp;"
                                        }} />
                                    </div>
                                    <div className="widget-content-right">
                                        <div className={`widget-numbers text-${this.props.widgetData.valGreen ? "success" : "primary"}`}>
                                            {this.props.widgetData.val}
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-progress-wrapper">
                                    <div className="progress-bar-xs progress-bar-animated-alt progress">
                                        <div
                                            className={`progress-bar bg-${this.props.widgetData.percentageGreen ? "success" : "primary"}`}
                                            role="progressbar"
                                            style={progressStyle}
                                        />
                                    </div>
                                    <div className="progress-sub-label">
                                        <div className="sub-label-left"></div>
                                        <div className="sub-label-right">100%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default ProgressWidget;
