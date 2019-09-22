import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';

class PageTenant extends React.Component {
    constructor(props) {
        super(props);
        this.editCallback = this.editCallback.bind(this);
        this.state = {
            dbTable: 'tenants',
            id: window.location.hash.split("/")[1],
            data: false,
            contract: ""
        };
    }
    editCallback(name, val) {
        this.state.tenantObj[name] = val;
        this.setState(() => {
            return {
                tenantObj: this.state.tenantObj
            }
        });
    }
    createTableStructure(data, apartments) {
        apartments = apartments.map(a => [a.id, a.name]);
        return [{
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Informacje kontaktowe",
            rowsData: data[0],
            rows: [
                ["Imię i Nazwisko", ["name"]],
                ["Dowód osobisty", ["id_number"]],
                ["Pesel", ["national_insurance_number"]],
                ["Data urodzenia", ["birth_date"]],
                ["E-mail", ["email"]],
                ["Telefon Kontaktowy", ["phone"]],
                ["Adres korespondencyjny", ["address"]],
                ["Pokój", [
                    "room_id",
                    [[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]]
                ]],
                ["Mieszkanie", [
                    "apartment_id",
                    apartments
                ]],
                ["Czynsz", ["rent"]],
                ["Pierwszy miesiąc", ["rent_first_month"]],
                ["Czynsz za pierwszy miesiąc", ["rent_first_rent"]],
                ["Kaucja", ["deposit"]],
                ["Konto bankowe", ["account"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Poręczyciel",
            rowsData: data[0],
            rows: [
                ["Imię i Nazwisko", ["ice_name"]],
                ["Dowód osobisty", ["ice_id_number"]],
                ["Pesel", ["ice_national_insurance_number"]],
                ["E-mail", ["ice_email"]],
                ["Telefon Kontaktowy", ["ice_phone"]],
                ["Adres korespondencyjny", ["ice_address"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Umowa",
            rowsData: data[0],
            rows: [
                ["Data zawarcia umowy", ["contract_date"]],
                ["Data rozpoczęcia najmu", ["contract_date_start"]],
                ["Data zakończenia najmu", ["contract_date_end"]],
                ["Data przekazania pokoju", ["contract_date_handoff"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Ubezpieczenie",
            headers: ["Nazwa Firmy", "Numer Polisy", "Data Ważności"],
            rowsData: data[0],
            rows: [[["insurance_name"], ["insurance_number"], ["insurance_date"]]]
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
    contractFill(content, tenantProps) {
        var arr = this.toArray(tenantProps);
        for (var key in arr) {
            content = this.replaceAll(
                content,
               "[" + key + "]",
                arr[key] ? arr[key] : "__________"
            );
        }
        return content;
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r="+this.state.dbTable, {id: this.state.id}),
            $.get("/api.php?r=apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(tenantData[0][0], apartmentsData[0]),
                    contract: tenantData[0][1][0].val,
                    tenantObj: tenantData[0][0][0]
                }
            });
        });
    }
    render() {
        var contract = this.state.data && this.contractFill(this.state.contract, this.state.tenantObj);
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
                        <div className="col-md-6">
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[1]} />
                            </div>
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[2]} />
                            </div>
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[3]} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                                <div className="card-shadow-info border mb-3 card card-body border-info">
                                    <h5 className="card-title">Umowa</h5>
                                    {contract.split('\n').map((item, i) => {
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
