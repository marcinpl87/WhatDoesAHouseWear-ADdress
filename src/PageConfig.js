import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbTable: 'config',
            id: window.location.hash.split("/")[1],
            data: false
        };
        this.delRow = this.delRow.bind(this);
        this.props.headerData.del = this.delRow;
    }
    delRow() {
        this.setState(() => {
            return {
                data: false
            }
        });
        $.when(
            $.get("/api.php", {r: this.state.dbTable, task: "del", id: this.state.id}),
        ).then(() => {
            window.location.hash = window.location.hash.split("/")[0];
        });
    }
    createTableStructure(data) {
        return [{
            dbTable: this.state.dbTable,
            id: this.state.id,
            rowsData: data[0],
            rows: [
                ["Klucz", ["text", "key_name"]],
                ["Wartość", ["text", "val"]]
            ]
        }];
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r="+this.state.dbTable, {id: this.state.id})
        ).then((data) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(data)
                }
            });
        });
    }
    render() {
        return (
            <div className="app-main__inner">
                {this.state.data ? <React.Fragment>
                    <PageHeader {...this.props.headerData} />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[0]} />
                            </div>
                        </div>
                    </div>
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageConfig;
