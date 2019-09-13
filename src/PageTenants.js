import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import Utils from './Utils';
import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageTenants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    createTableStructure(data, apartments) {
        return {
            title: false,
            clickableHash: "tenants",
            headers: ["Id", "Imię", "Nazwisko", "Mieszkanie", "Pokój", "Saldo"],
            rows: data.map(x => {
                x.apartment_id = Utils.findArrValById(
                    apartments.map(a => [a.id, a.name]),
                    x.apartment_id
                );
                return Object.values(x);
            })
        };
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r=tenants"),
            $.get("/api.php?r=apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(tenantData[0], apartmentsData[0]),
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
