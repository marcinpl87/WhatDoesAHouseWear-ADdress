import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import ProgressWidget from './ProgressWidget';
import ChartComponent from './ChartComponent';
import LoaderComponent from './LoaderComponent';

class PageHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r=charts")
        ).then((chartsData) => {
            this.setState(() => {
                return {
                    data: Object.values(chartsData)
                }
            });
        });
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
                {this.state.data ? this.state.data.map((c, i) => {
                    return <div className="row" key={i}>
                        <div className="col-md-12">
                            <ChartComponent config={c} />
                        </div>
                    </div>
                }) : <LoaderComponent />}
            </div>
        )
    }
}

export default PageHome;
