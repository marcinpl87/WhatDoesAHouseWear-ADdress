import React from 'react';
import ReactDOM from 'react-dom';

import TabPaneTable from './TabPaneTable';
import CategoriseTransactionsAdd from './CategoriseTransactionsAdd';
import MTable from './MTable';

class CategoriseTransactionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flatArr: props.paneData.data.rules.map(x => Object.values(x))
        };
        this.onNewRow = this.onNewRow.bind(this);
    }
    arrayToObject(arr) {
        return arr.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {});
    }
    getColumnsObj() {
        return {2: "Kwota", 3: "Nadawca", 4: "Odbiorca", 5: "Tytuł"}
    }
    getRelationsObj() {
        return {1: "==", 2: "=>", 3: ">", 4: "<=", 5: "<"}
    }
    getCategoriesObj() {
        return this.arrayToObject(this.props.paneData.data.categories);
    }
    onNewRow(row) {
        var newFlatArr = this.state.flatArr;
        newFlatArr.push([
            0,
            parseInt(row.transaction_column),
            parseInt(row.relation),
            row.value,
            parseInt(row.category_id)
        ]);
        this.setState({
            flatArr: newFlatArr
        });
    }
    render() {
        var categories = this.props.paneData.data.categories.map(x => Object.values(x));
        var flatArr = this.state.flatArr;
        flatArr.map(x => {
            x[1] = this.getColumnsObj()[parseInt(x[1])];
            x[2] = this.getRelationsObj()[parseInt(x[2])];
            x[4] = this.getCategoriesObj()[parseInt(x[4])].name;
            return x;
        });
        var tableData = {
            title: false,
            headers: false,
            rows: flatArr
        };
        var columnsArr = Object.keys(this.getColumnsObj()).map((key) => {
            return [Number(key), this.getColumnsObj()[key]];
        });
        return (
            <React.Fragment>
                <div className="col-md-6">
                    <div className="main-card mb-3 card">
                        <div className="card-header">
                            Nowa reguła kategoryzacji transakcji
                        </div>
                        <CategoriseTransactionsAdd
                            columnsArr={columnsArr}
                            onNewRow={this.onNewRow}
                            catData={categories} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-header">
                        Reguły kategoryzacji transakcji
                    </div>
                    <div className="main-card mb-3 card">
                        <MTable tableData={tableData} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CategoriseTransactionsComponent;
