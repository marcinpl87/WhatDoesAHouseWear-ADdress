import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageConfigs extends React.Component {
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
            $.get("/api.php", {r: "fixes", task: "add"}),
        ).then(() => {
            this.getData();
        });
    }
    createTableStructure(data) {
        return {
            title: false,
            clickableHash: this.props.headerData.hash,
            headers: ["Id", "Klucz", "Wartość"],
            rows: data.map(x => {
                return Object.values(x);
            })
        };
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        $.when(
            $.get("/api.php", {r: this.props.headerData.hash})
        ).then((data) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(data),
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

export default PageConfigs;
