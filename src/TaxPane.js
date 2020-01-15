import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

import Utils from './Utils';
import TabPaneTable from './TabPaneTable';
registerLocale("pl", pl);

class TaxPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: false,
            date: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)
        };
    }
    filter() {
        this.props.paneData.onDateChange(
            this.state.date,
            this.state.filter,
            this.props.paneData.data.monthView
        );
    }
    render() {
        if (this.props.paneData.data.yearReport) {
            var taxSum = this.props.paneData.data.yearReport;
            var taxOfficeSum = this.props.paneData.data.yearTaxOfficeReport;
            var taxToPay = 0;
            var msg = taxSum[1].length + " transakcji w roku:\n"
            + taxSum[1].join(" + ") + "\n= "
            + Utils.mRound(taxSum[0], 0) + "zł\n\n";
            if (taxSum[0] < 100000) {
                taxToPay = Utils.mRound(taxSum[0] * 0.085);
                msg += "Łącznie suma podatku do zapłacenia: " + taxToPay + "zł\n\n";
            }
            else {
                var highTax = (taxSum[0] - 100000) * 0.125;
                taxToPay = Utils.mRound(highTax + 8500);
                msg += "Suma do zapłacenia 8,5% podatku (do 100k): 8500zł\n"
                + "Suma do zapłacenia 12,5% podatku (powyżej 100k): " + Utils.mRound(highTax) + "zł\n"
                + "Łącznie suma podatku do zapłacenia: " + taxToPay + "zł\n\n";
            }
            var taxPayed = Utils.mRound(taxOfficeSum[0] * -1, 0);
            msg += taxOfficeSum[1].length + " wpłat do urzędu w roku:\n"
            + Utils.replaceAll(taxOfficeSum[1].reverse().join("zł + "), "-", "") + "zł\n= "
            + taxPayed + "zł\n\n"
            + "Ile trzeba jeszcze zapłacić podatku: " + Utils.mRound(taxToPay - taxPayed, 2) + "zł";
        }
        else {
            var taxSum = Utils.sumTax(this.props.paneData.data.transactions);
            var msg = taxSum[1].length + " transakcji:\n"
            + taxSum[1].join(" + ") + " = "
            + Utils.mRound(taxSum[0]) + "zł\n\n"
            // + Utils.mRound(taxSum[0]) + " * 0,125 = "
            // + Utils.mRound(taxSum[0]*0.125) + " = "
            // + Utils.mRound(taxSum[0]*0.125, 0) + "zł\n\n"
            + "Podatek za poprzedni miesiąc zapłacony w tym miesiącu: " + this.props.paneData.data.taxPayed + "zł";
        }
        var mvStr = this.props.paneData.data.monthView.toString();
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3">
                        {this.props.paneData.data.monthView && <DatePicker
                            dateFormat={"pl"}
                            locale="pl"
                            selected={this.state.date}
                            onChange={date => {
                                this.setState(
                                    () => {return {date: date}},
                                    () => {this.filter()}
                                );
                            }}
                            showMonthYearPicker
                            inline
                        />}
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`check${mvStr}`}
                                onChange={() => {
                                    this.setState(
                                        prev => {return {filter: !prev.filter}},
                                        () => {this.filter()}
                                    );
                                }}
                            />
                            <label className="form-check-label" htmlFor={`check${mvStr}`}>
                                Tylko przychody
                            </label>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card-shadow-info border mb-3 card card-body border-info">
                            <h5 className="card-title">Podatek</h5>
                            {msg.split('\n').map((item, i) => {
                                return <span key={i}>{item}<br /></span>;
                            })}
                        </div>
                    </div>
                </div>
                <TabPaneTable paneData={this.props.paneData} />
            </React.Fragment>
        )
    }
}

export default TaxPane;
