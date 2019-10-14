import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageFix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbTable: 'fixes',
            id: window.location.hash.split("/")[1],
            data: false
        };
    }
    createTableStructure(data, apartments) {
        apartments = apartments.map(a => [a.id, a.name]);
        return [{
            dbTable: this.state.dbTable,
            id: this.state.id,
            rowsData: data[0],
            rows: [
                ["Data dodania", ["date_add"]],
                ["Data usterki", ["date_event"]],
                ["Opis", ["description"]],
                ["Kwota", ["price"]],
                ["Mieszkanie", ["apartment_id", apartments]]
            ]
        }];
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r="+this.state.dbTable, {id: this.state.id}),
            $.get("/api.php?r=apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(tenantData[0], apartmentsData[0])
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
