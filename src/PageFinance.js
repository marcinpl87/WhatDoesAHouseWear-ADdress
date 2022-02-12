import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';
import TabPaneTable from './TabPaneTable';
import LoaderComponent from './LoaderComponent';
import PageHeader from './PageHeader';
import TabPane from './TabPane';
import TaxPaneYear from './TaxPaneYear';
import TaxPaneMonth from './TaxPaneMonth';
import TabPaneUpload from './TabPaneUpload';
import TabsComponent from './TabsComponent';
import LongText from './LongText';

class PageFinance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll: {},
            dataAPI: {},
            taxReport: false,
            dataPayments: false
        };
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
                dataPayments: Utils.fin().createTableStructure(oneYear)
            }
        });
    }
    createTaxStructure(data) {
        return {
            data: data,
            title: false,
            headers: [
                "Id",
                "Miesiąc",
                "Transakcje",
                "Przychód",
                "Należny podatek",
                "Zapłacony podatek",
                "Saldo podatku",
            ],
            rows: data.months.map((x) => {
                var row = Object.values(x);
                row[2] = <LongText text={row[2]} />;
                return row;
            }),
        };
    }
    componentDidMount() {
        $.when(
            Utils.ajax(
                "get",
                "taxReport"
            ),
            Utils.ajax(
                "get",
                "finance"
            )
        ).then((
            taxData,
            financeData
        ) => {
            financeData[0].firstYear = new Date().getFullYear();
            financeData[0].transactions.map((row) => {
                financeData[0].firstYear = (
                    financeData[0].firstYear >= row.date_transaction.substr(6, 4)
                )
                    ? row.date_transaction.substr(6, 4)
                    : financeData[0].firstYear;
            });
            this.setState(() => {
                return {
                    dataAll: Utils.fin().createTableStructure(
                        financeData[0]
                    ),
                    dataAPI: financeData[0],
                    taxReport: this.createTaxStructure(
                        taxData[0]
                    ),
                }
            }, () => {
                this.filterPayments();
            });
        });
    }
    render() {
        var config = [
            [TabPaneTable, "Wszystkie", this.state.dataAll],
            [TaxPaneMonth, "Miesiąc", this.state.dataAPI],
            [TaxPaneYear, "Rok", this.state.dataAPI],
            [TabPaneTable, "Płatności", this.state.dataPayments],
            [TabPaneTable, "Raport", this.state.taxReport],
            [TabPaneUpload, "Upload", this.state.dataAll]
        ];
        return (
            <div className="app-main__inner">
                {this.state.dataPayments ? <React.Fragment>
                    <PageHeader {...this.props.headerData} />
                    <TabsComponent tabsConfig={config} />
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageFinance;
