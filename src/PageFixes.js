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
    }
    createTableStructure(data, apartments) {
        return {
            title: false,
            clickableHash: "fixes",
            headers: ["Id", "Data zgłoszenia", "Data naprawy", "Opis", "Cena", "Mieszkanie"],
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
            $.get("/api.php?r=fixes", {apartmentId: this.props.apartmentId}),
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
