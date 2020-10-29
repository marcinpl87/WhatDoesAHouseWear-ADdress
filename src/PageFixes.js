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
            Utils.ajax("post", this.props.headerData.hash)
        ).then(() => {
            this.getData();
        });
    }
    createTableStructure(data, apartments) {
        var headers = this.props.headerData.headers.map((x) => {
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
            Utils.ajax("get", this.props.headerData.hash),
            Utils.ajax("get", "apartments")
        ).then((fixesData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(
                        fixesData[0][this.props.headerData.hash],
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
