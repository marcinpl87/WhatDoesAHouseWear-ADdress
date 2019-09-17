import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import ProgressWidget from './ProgressWidget';

class PageHome extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        var dataContracts = {
            title: "Podpisane umowy",
            subTitle: false,
            val: "1",
            valGreen: true,
            percentage: "10",
            percentageGreen: false,
        }
        var dataPayments = {
            title: "Płatności",
            subTitle: "Opłacone w tym miesiącu",
            val: "12999zł",
            valGreen: false,
            percentage: "100",
            percentageGreen: true,
        }
        return (
            <div className="app-main__inner">
                <PageHeader {...this.props.headerData} />
                <div className="row">
                    <div className="col-md-6">
                        <ProgressWidget widgetData={dataContracts} />
                    </div>
                    <div className="col-md-6">
                        <ProgressWidget widgetData={dataPayments} />
                    </div>
                </div>
            </div>
        )
    }
}

export default PageHome;
