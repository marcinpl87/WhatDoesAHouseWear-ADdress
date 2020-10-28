import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import MTable from './MTable';
import PageHeader from './PageHeader';
import LoaderComponent from './LoaderComponent';
import Utils from './Utils';

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
                ["Imię i Nazwisko", ["text", "name"]],
                ["Nadawca przelewu", ["text", "sender_name"]],
                ["Dowód osobisty", ["text", "id_number"]],
                ["Pesel", ["text", "national_insurance_number"]],
                ["Data urodzenia", ["date", "birth_date"]],
                ["E-mail", ["text", "email"]],
                ["Telefon Kontaktowy", ["text", "phone"]],
                ["Adres korespondencyjny", ["text", "address"]],
                ["Pokój", [
                    "list",
                    "room_id",
                    [[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]]
                ]],
                ["Mieszkanie", [
                    "list",
                    "apartment_id",
                    apartments
                ]],
                ["Czynsz", ["text", "rent"]],
                ["Pierwszy miesiąc", ["text", "rent_first_month"]],
                ["Czynsz za pierwszy miesiąc", ["text", "rent_first_rent"]],
                ["Kaucja", ["text", "deposit"]],
                ["Konto bankowe", ["text", "account"]],
                ["Notatki", ["text", "notes"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Onboarding",
            rowsData: data[0],
            rows: [
                ["Umowa podpisana", [
                    "checkbox",
                    "is_contract",
                    [[1, "1"]]
                ]],
                ["Kaucja opłacona", [
                    "checkbox",
                    "is_deposit",
                    [[1, "1"]]
                ]],
                ["1 czynsz opłacony", [
                    "checkbox",
                    "is_1st_rent",
                    [[1, "1"]]
                ]],
                ["Polisa odebrana", [
                    "checkbox",
                    "is_insurance",
                    [[1, "1"]]
                ]],
                ["Poręczenie odebrane", [
                    "checkbox",
                    "is_warranty",
                    [[1, "1"]]
                ]],
                ["Klucze wydane", [
                    "checkbox",
                    "is_key",
                    [[1, "1"]]
                ]],
                ["Protokół podpisany", [
                    "checkbox",
                    "is_protocol",
                    [[1, "1"]]
                ]],
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Poręczyciel",
            rowsData: data[0],
            rows: [
                ["Imię i Nazwisko", ["text", "ice_name"]],
                ["Dowód osobisty", ["text", "ice_id_number"]],
                ["Pesel", ["text", "ice_national_insurance_number"]],
                ["E-mail", ["text", "ice_email"]],
                ["Telefon Kontaktowy", ["text", "ice_phone"]],
                ["Adres korespondencyjny", ["text", "ice_address"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Umowa",
            rowsData: data[0],
            rows: [
                ["Data zawarcia umowy", ["date", "contract_date"]],
                ["Data rozpoczęcia najmu", ["date", "contract_date_start"]],
                ["Data zakończenia najmu", ["date", "contract_date_end"]],
                ["Data przekazania pokoju", ["date", "contract_date_handoff"]]
            ]
        }, {
            dbTable: this.state.dbTable,
            id: this.state.id,
            callback: this.editCallback,
            title: "Ubezpieczenie",
            headers: ["Nazwa Firmy", "Numer Polisy", "Data Ważności"],
            rowsData: data[0],
            rows: [[
                ["text", "insurance_name"],
                ["text", "insurance_number"],
                ["date", "insurance_date"]
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
    contractFill(content, tenantProps) {
        var arr = this.toArray(tenantProps);
        for (var key in arr) {
            content = Utils.replaceAll(
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
            Utils.ajax("get", "apartments")
        ).then((tenantData, apartmentsData) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(
                        tenantData[0][0],
                        apartmentsData[0].apartments
                    ),
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
                            <div className="main-card mb-3 card">
                                <MTable tableData={this.state.data[4]} />
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
