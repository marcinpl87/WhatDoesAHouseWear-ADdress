import React from 'react';
import ReactDOM from 'react-dom';

import TabPaneTable from './TabPaneTable';
import LoaderComponent from './LoaderComponent';
import PageHeader from './PageHeader';
import TabPane from './TabPane';
import LongText from './LongText';
import BadgeButton from './BadgeButton';
import TabsComponent from './TabsComponent';

class PageFinance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            dataAll: {},
            dataLastMonth: {}
        };
    }
    prepareData(data) {
        var flatArr = data.transactions.map(x => Object.values(x));
        var flatRules = data.rules.map(x => Object.values(x));
        flatArr.map((el) => {
            el[5] = <LongText text={el[5]} />;
            el[6] = <BadgeButton
                cat={el[6]}
                allCat={data.categories}
                transactionData={el}
                rulesData={flatRules}
            />;
        });
        return flatArr;
    }
    prepareRawData(data) {
        var flatArr = data.map(x => Object.values(x));
        flatArr.map((el) => {
            el[2] = el[2].toFixed(2);
        });
        return flatArr;
    }
    createTableStructure(data) {
        return {
            data: data,
            title: false,
            headers: ["Id", "Data", "Kwota", "Nadawca", "Odbiorca", "Tytuł", "Kategoria_Transakcji____"],
            rawData: this.prepareRawData(JSON.parse(JSON.stringify(data)).transactions), //clone
            rows: this.prepareData(data)
        };
    }
    componentDidMount() {
        $.get("/api.php?r=finance", (data) => {
            var prevMonthDate = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)
                .toLocaleDateString("en-US", {year: 'numeric', month: 'numeric'})
                .split("/");
            var lastMonth = JSON.parse(JSON.stringify(data)); //clone
            var filtered = lastMonth.transactions.filter((row) => {
                return row.date_transaction.substr(3, 2) == String("0" + prevMonthDate[0]).slice(-2)
                    && row.date_transaction.substr(8, 2) == prevMonthDate[1].slice(-2);
            });
            lastMonth.transactions = filtered;
            this.setState((prevState, props) => {
                return {
                    isReady: true,
                    dataAll: this.createTableStructure(data),
                    dataLastMonth: this.createTableStructure(lastMonth)
                }
            });
        });
    }
    render() {
        var config = [
            [TabPaneTable, "Wszystkie", this.state.dataAll],
        ];
        return (
            <div className="app-main__inner">
                {this.state.isReady ? <React.Fragment>
                    <PageHeader {...this.props.headerData} />
                    <TabsComponent tabsConfig={config} />
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageFinance;
