import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageTenant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbTable: 'tenant',
            id: window.location.hash.split("/")[1],
            isReady: false,
            data: {},
            contract: ""
        };
    }
    createTableStructure(data) {
        return [{
            dbTable: this.state.dbTable,
            id: this.state.id,
            title: "Informacje kontaktowe",
            headers: false,
            rows: [
                ["Imię i Nazwisko", ["name", data[0].name]],
                ["Dowód osobisty", ["id_number", data[0].id_number]],
                ["Pesel", ["national_insurance_number", data[0].national_insurance_number]],
                ["Data urodzenia", ["birth_date", data[0].birth_date]],
                ["E-mail", ["email", data[0].email]],
                ["Telefon Kontaktowy", ["phone", data[0].phone]],
                ["Adres korespondencyjny", ["address", data[0].address]],
                ["Pokój", ["room_id", data[0].room_id]],
                ["Czynsz", ["rent", data[0].rent]],
                ["Kaucja", ["deposit", data[0].deposit]],
                ["Konto bankowe", ["account", data[0].account]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            title: "Poręczyciel",
            headers: false,
            rows: [
                ["Imię i Nazwisko", ["ice_name", data[0].ice_name]],
                ["Dowód osobisty", ["ice_id_number", data[0].ice_id_number]],
                ["Pesel", ["ice_national_insurance_number", data[0].ice_national_insurance_number]],
                ["E-mail", ["ice_email", data[0].ice_email]],
                ["Telefon Kontaktowy", ["ice_phone", data[0].ice_phone]],
                ["Adres korespondencyjny", ["ice_address", data[0].ice_address]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            title: "Ubezpieczenie",
            headers: ["Nazwa Firmy", "Numer Polisy", "Data Ważności"],
            rows: [[
                ["insurance_name", data[0].insurance_name],
                ["insurance_number", data[0].insurance_number],
                ["insurance_date", data[0].insurance_date]
            ]]
        }];
    }
    toArray(_Object){
       var _Array = new Array();
       for(var name in _Object){
               _Array[name] = _Object[name];
       }
       return _Array;
    }
    replaceAll(str, find, replace) {
        return str.replace(
            new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'),
            replace
        );
    }
    testReplace(content, tenantProps) {
        var arr = this.toArray(tenantProps);
        for (var key in arr) {
            content = this.replaceAll(
                content,
               "[" + key + "]",
                arr[key]
            );
        }
        return content;
    }
    componentDidMount() {
        $.get("/api.php?r="+this.state.dbTable, {id: this.state.id}, (data) => {
            this.setState((prevState, props) => {
                return {
                    isReady: true,
                    data: this.createTableStructure(data[0]),
                    contract: this.testReplace(data[1][0].val, data[0][0])
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
                        <div className="col-md-6">
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[0]} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[1]} />
                            </div>
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[2]} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                                <div className="card-shadow-info border mb-3 card card-body border-info">
                                    <h5 className="card-title">Umowa</h5>
                                    {this.state.contract.split('\n').map((item, i) => {
                                        return <span key={i}>{item}<br /></span>;
                                    })}
                                </div>
                        </div>
                    </div>
                </React.Fragment> : <LoaderComponent />}
            </div>
        )
    }
}

export default PageTenant;
