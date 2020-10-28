import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';
import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageFixes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
        this.addRow = this.addRow.bind(this);
        this.getData = this.getData.bind(this);
        this.props.headerData.add = this.addRow;
    }
    addRow() {
        this.setState(() => {
            return {
                data: false,
            }
        });
        $.when(
            $.get("/api.php", {r: this.props.headerData.hash, task: "add"}),
        ).then(() => {
            this.getData();
        });
    }
    createTableStructure(data, apartments) {
        var headers = this.props.headerData.headers.map(function(x) {
            return x[0];
        });
        headers.unshift("Id");
        return {
            title: false,
            clickableHash: this.props.headerData.hash,
            headers: headers,
            rows: data.map(x => {
                x.apartment_id = Utils.findArrValById(
                    apartments.map(a => [a.id, a.name]),
                    x.apartment_id
                );
                x.apartment_id = x.apartment_id || "";
                return Object.values(x);
            })
        };
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        $.when(
            $.get("/api.php", {r: this.props.headerData.hash}),
            Utils.ajax("get", "apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(
                        tenantData[0],
                        apartmentsData[0].apartments
                    ),
                }
            });
        });
    }
    render() {
        return (
            <div className="app-main__inner">
                <PageHeader {...this.props.headerData} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-card mb-3 card">
                            {this.state.data ? <React.Fragment>
                                <MTable tableData={this.state.data} />
                            </React.Fragment> : <LoaderComponent />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageFixes;
