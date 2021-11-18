import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

import Utils from './Utils';
import TabPaneTable from './TabPaneTable';
registerLocale("pl", pl);

class TaxPaneMonth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: false,
            date: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)
        };
    }
    filterMonth(filter, inputDate) {
        var selected = inputDate
            .toLocaleDateString("en-US", {year: 'numeric', month: 'numeric'})
            .split("/");
        var oneMonth = JSON.parse(JSON.stringify(this.props.paneData)); //clone
        oneMonth.transactions = oneMonth.transactions.filter((row) => {
            return row.date_transaction.substr(3, 2) == String("0" + selected[0]).slice(-2)
                && row.date_transaction.substr(8, 2) == selected[1].slice(-2);
        }).filter((row) => {
            return filter ? row.value > 0 : true;
        });
        oneMonth.monthView = true;
        oneMonth.taxPayed = Utils.sumTax(oneMonth.transactions, 7)[0];
        return oneMonth;
    }
    render() {
        var data = Utils.fin().createTableStructure(this.filterMonth(
            this.state.filter,
            this.state.date
        ));
        var taxSum = Utils.sumTax(data.data.transactions);
        var msg = taxSum[1].length + " transakcji:\n"
        + taxSum[1].join(" + ") + " = "
        + Utils.mRound(taxSum[0]) + "zł\n\n"
        + "Podatek w tym miesiącu (8,5%): "
        + Utils.mRound(
            taxSum[0] * 0.085
        )
        + "zł\n"
        + "Podatek w tym miesiącu (12,5%): "
        + Utils.mRound(
            taxSum[0] * 0.125
        )
        + "zł\n"
        + "Podatek za poprzedni miesiąc zapłacony w tym miesiącu: " + Utils.replaceAll(
            data.data.taxPayed,
            "-",
            ""
        ) + "zł";
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3">
                        <DatePicker
                            dateFormat={"pl"}
                            locale="pl"
                            selected={this.state.date}
                            onChange={date => {
                                this.setState(
                                    () => {return {date: date}}
                                );
                            }}
                            showMonthYearPicker
                            inline
                        />
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="check-year"
                                onChange={() => {
                                    this.setState(
                                        prev => {return {filter: !prev.filter}}
                                    );
                                }}
                            />
                            <label className="form-check-label" htmlFor="check-year">
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
                <TabPaneTable paneData={data} />
            </React.Fragment>
        )
    }
}

export default TaxPaneMonth;
