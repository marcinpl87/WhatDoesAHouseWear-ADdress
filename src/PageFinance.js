import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';
import TabPaneTable from './TabPaneTable';
import LoaderComponent from './LoaderComponent';
import PageHeader from './PageHeader';
import TabPane from './TabPane';
import TaxPane from './TaxPane';
import TabPaneUpload from './TabPaneUpload';
import LongText from './LongText';
import BadgeButton from './BadgeButton';
import TabsComponent from './TabsComponent';

class PageFinance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll: {},
            dataAPI: {},
            dataYear: false,
            dataMonth: false,
            dataPayments: false
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
            el[2] = parseFloat(el[2]).toFixed(2);
        });
        return flatArr;
    }
    createTableStructure(data) {
        return {
            data: data,
            title: false,
            onDateChange: (date, filter, isMonth) => {
                isMonth
                    ? this.filterMonth(date, filter)
                    : this.filterYear(new Date().getFullYear(), filter);
            },
            headers: ["Id", "Data", "Kwota", "Nadawca", "Odbiorca", "Tytuł", "Kategoria_Transakcji____"],
            rawData: this.prepareRawData(JSON.parse(JSON.stringify(data)).transactions), //clone
            rows: this.prepareData(data)
        };
    }
    filterMonth(inputDate = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1), filter = false, isMonth) {
        var selected = inputDate
            .toLocaleDateString("en-US", {year: 'numeric', month: 'numeric'})
            .split("/");
        var oneMonth = JSON.parse(JSON.stringify(this.state.dataAPI)); //clone
        oneMonth.transactions = oneMonth.transactions.filter((row) => {
            return row.date_transaction.substr(3, 2) == String("0" + selected[0]).slice(-2)
                && row.date_transaction.substr(8, 2) == selected[1].slice(-2);
        }).filter((row) => {
            return filter ? row.value > 0 : true;
        });
        oneMonth.monthView = true;
        oneMonth.taxPayed = Utils.sumTax(oneMonth.transactions, 7)[0];
        this.setState(() => {
            return {
                dataMonth: this.createTableStructure(oneMonth)
            }
        });
    }
    // filterYear(inputDate = new Date().getFullYear(), filter = false) {
    filterYear(inputDate = "2019", filter = false) {
        var oneYear = JSON.parse(JSON.stringify(this.state.dataAPI)); //clone
        oneYear.transactions = oneYear.transactions.filter((row) => {
            return row.date_transaction.substr(6, 4) == inputDate
        }).filter((row) => {
            return filter ? row.value > 0 : true;
        });
        oneYear.monthView = false;
        oneYear.yearReport = Utils.sumTax(oneYear.transactions);
        oneYear.yearTaxOfficeReport = Utils.sumTax(oneYear.transactions, 7);
        this.setState(() => {
            return {
                dataYear: this.createTableStructure(oneYear)
            }
        });
    }
    filterPayments() {
        var oneYear = JSON.parse(JSON.stringify(this.state.dataAPI)); //clone
        oneYear.transactions = oneYear.transactions.filter((row) => {
            return row.date_transaction.substr(6, 4) == new Date().getFullYear();
        }).filter((row) => {
            return row.value > 0;
        }).filter((row) => {
            return row.category_id == 5;
        });
        this.setState(() => {
            return {
                dataPayments: this.createTableStructure(oneYear)
            }
        });
    }
    componentDidMount() {
        Utils.ajax(
            "get",
            "finance"
        ).done((data) => {
            data.firstYear = new Date().getFullYear();
            data.transactions.map((row) => {
                data.firstYear = data.firstYear >= row.date_transaction.substr(6, 4)
                    ? row.date_transaction.substr(6, 4)
                    : data.firstYear;
            });
            this.setState(() => {
                return {
                    dataAll: this.createTableStructure(data),
                    dataAPI: data,
                }
            }, () => {
                this.filterMonth();
                this.filterYear();
                this.filterPayments();
            });
        });
    }
    render() {
        var config = [
            [TabPaneTable, "Wszystkie", this.state.dataAll],
            [TaxPane, "Miesiąc", this.state.dataMonth],
            [TaxPane, "Rok", this.state.dataYear],
            [TabPaneTable, "Płatności", this.state.dataPayments],
            [TabPaneUpload, "Upload", this.state.dataAll]
        ];
        return (
            <div className="app-main__inner">
                {this.state.dataMonth ? <React.Fragment>
                    <PageHeader {...this.props.headerData} />
                    <TabsComponent tabsConfig={config} />
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageFinance;
