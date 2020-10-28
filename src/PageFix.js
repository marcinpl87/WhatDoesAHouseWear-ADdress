import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';
import Utils from './Utils';

class PageFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbTable: props.headerData.hash,
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
            $.get("/api.php", {r: this.props.headerData.hash, task: "del", id: this.state.id}),
        ).then(() => {
            window.location.hash = window.location.hash.split("/")[0];
        });
    }
    createTableStructure(data, apartments) {
        apartments = apartments.map(a => [a.id, a.name]);
        this.props.headerData.headers.map(header => {
            header[1][2] = (header[1][2] == "--data--") ? apartments : header[1][2];
            return header;
        });
        return [{
            dbTable: this.state.dbTable,
            id: this.state.id,
            rowsData: data[0],
            rows: this.props.headerData.headers
        }];
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r="+this.state.dbTable, {id: this.state.id}),
            Utils.ajax("get", "apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(tenantData[0], apartmentsData[0].apartments)
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
                        <div className="col-md-6">
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

export default PageFix;
