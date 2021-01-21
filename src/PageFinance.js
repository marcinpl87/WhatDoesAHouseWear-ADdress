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

class PageFinance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAll: {},
            dataAPI: {},
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
                    dataAll: Utils.fin().createTableStructure(data),
                    dataAPI: data,
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
