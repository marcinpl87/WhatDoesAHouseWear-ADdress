import React from 'react';
import ReactDOM from 'react-dom';
import ProgressWidget from './ProgressWidget';

class InvestmentWidget extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ProgressWidget widgetData={{
                "percentage": this.props.dateStart
                    && (100 - Math.round(
                        ((new Date(this.props.dateEnd)).getTime() - (new Date()).getTime())
                        / ((new Date(this.props.dateEnd)).getTime() - (new Date(this.props.dateStart)).getTime())
                        * 100
                    )),
                "percentageGreen": true,
                "subTitle": this.props.dateStart ? (this.props.dateStart + " - " + this.props.dateEnd) : this.props.dateEnd,
                "title": this.props.name,
                "val": this.props.amount,
                "valGreen": false,
                "timer": this.props.dateEnd && new Date(this.props.dateEnd + "T00:00:00+01:00")
            }} />
        )
    }
}

export default InvestmentWidget;
