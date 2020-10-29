import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';
import MTable from './MTable';
import LoaderComponent from './LoaderComponent';

class TenantsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onboarding: false,
            data: false
        };
    }
    createTableStructure(data, apartments, transactions) {
        return {
            title: false,
            clickableHash: "tenants",
            headers: ["Id", "Imię i Nazwisko", "Mieszkanie", "Pokój", "Czynsz", "Wpłacono"],
            emails: data.map(x => {
                return x.email;
            }).filter((x) => {
                return x != null;
            }),
            rows: data.map(x => {
                var paid = 0;
                transactions.map(t => {
                    if (
                        (x.sender_name !== null)
                        && (t.sender !== null)
                        && (x.sender_name.toLowerCase() == t.sender.toLowerCase())
                    ) {
                        paid += parseInt(t.value);
                    }
                });
                x.apartment_id = Utils.findArrValById(
                    apartments.map(a => [a.id, a.name]),
                    x.apartment_id
                );
                x.paid = paid;
                delete x.email;
                delete x.sender_name;
                return Object.values(x);
            })
        };
    }
    createOnboardingStructure(data) {
        return {
            title: false,
            clickableHash: "tenants",
            headers: ["Id", "Imię i Nazwisko", "Umowa podpisana", "Kaucja opłacona", "1 czynsz opłacony", "Polisa odebrana", "Poręczenie odebrane", "Klucze wydane", "Protokół podpisany"],
            rows: data.map(x => {
                var checkboxes = Object.values(x).map(binaryValue => {
                    return (binaryValue == "1") ? "☑" : "";
                });
                checkboxes[0] = x.id;
                checkboxes[1] = x.name;
                return checkboxes;
            })
        };
    }
    componentDidMount() {
        $.when(
            Utils.ajax("get", this.props.apartmentId
                ? "tenantsOnboardingInApartment/" + this.props.apartmentId
                : "tenantsOnboarding"),
            Utils.ajax("get", this.props.apartmentId
                ? "tenantsInApartment/" + this.props.apartmentId
                : "tenants"),
            Utils.ajax("get", "apartments"),
            Utils.ajax("get", "finance")
        ).then((onboardingData, tenantsData, apartmentsData, financeData) => {
            financeData[0].transactions = financeData[0].transactions.filter((row) => {
                return row.date_transaction.substr(6, 4) == new Date().getFullYear();
            }).filter((row) => {
                return row.value > 0;
            }).filter((row) => {
                return row.category_id == 5;
            });
            this.setState(() => {
                return {
                    onboarding: this.createOnboardingStructure(onboardingData[0].tenants),
                    data: this.createTableStructure(
                        tenantsData[0].tenants,
                        apartmentsData[0].apartments,
                        financeData[0].transactions
                    ),
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
                <div className="main-card mb-3 card">
                    <MTable tableData={this.state.onboarding} />
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
