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
            <div className="main-card mb-3 card">
                {this.state.data ? <React.Fragment>
                    <MTable tableData={this.state.data} />
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default TenantsComponent;
