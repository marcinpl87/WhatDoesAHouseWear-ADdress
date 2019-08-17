import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageTenants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            data: {}
        };
    }
    createTableStructure(data) {
        return {
            title: false,
            clickableHash: "tenants",
            headers: ["Id", "Imię", "Nazwisko", "Mieszkanie", "Pokój", "Saldo"],
            rows: data.map(x => Object.values(x))
        };
    }
    componentDidMount() {
        $.get("/api.php?r=tenants", (data) => {
            this.setState((prevState, props) => {
                return {
                    isReady: true,
                    data: this.createTableStructure(data)
                }
            });
        });
    }
    render() {
        return (
            <div className="app-main__inner">
                {this.state.isReady ? <React.Fragment>
                    <PageHeader {...this.props.headerData} />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data} />
                            </div>
                        </div>
                    </div>
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageTenants;
