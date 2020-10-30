import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';
import InvestmentWidget from './InvestmentWidget';
import Utils from './Utils';

class PageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
        };
    }
    componentDidMount() {
        $.when(
            Utils.ajax("get", "configByName/investments")
        ).then((inv) => {
            this.setState(() => {
                return {
                    data: JSON.parse(inv.config[0].val)
                }
            });
        });
    }
    render() {
        return (
            <div className="app-main__inner">
                <PageHeader {...{...this.props.headerData, ...{dataTitle: "Dashboard"}}} />
                {this.state.data ? this.state.data.map((inv, index) => {
                    return <InvestmentWidget
                        amount={inv.amount}
                        name={inv.name}
                        dateStart={inv.dateStart}
                        dateEnd={inv.dateEnd}
                        key={index}
                    />
                }) : <LoaderComponent />}
            </div>
        )
    }
}

export default PageDashboard;
