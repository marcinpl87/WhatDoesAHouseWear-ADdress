import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';
import MTable from './MTable';
import LoaderComponent from './LoaderComponent';

class TenantsComponent extends React.Component {
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
            headers: ["Id", "Imię i Nazwisko", "Mieszkanie", "Pokój", "Czynsz"],
            emails: data.map(x => {
                return x.email;
            }).filter((x) => {
                return x != null;
            }),
            rows: data.map(x => {
                x.apartment_id = Utils.findArrValById(
                    apartments.map(a => [a.id, a.name]),
                    x.apartment_id
                );
                delete x.email;
                return Object.values(x);
            })
        };
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r=tenants", {apartmentId: this.props.apartmentId}),
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
            <React.Fragment>
            {this.state.data ? <React.Fragment>
                <div className="main-card mb-3 card">
                    <MTable tableData={this.state.data} />
                </div>
                <div className="card-shadow-info border mb-3 card card-body border-info">
                    <h5 className="card-title">Emaile najemców</h5>
                    {this.state.data.emails && this.state.data.emails.join(", ")}
                </div>
            </React.Fragment> : <LoaderComponent />}
            </React.Fragment>
        )
    }
}

export default TenantsComponent;
