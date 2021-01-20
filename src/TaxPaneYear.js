import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

import Utils from './Utils';
import LongText from './LongText';
import BadgeButton from './BadgeButton';
import TabPaneTable from './TabPaneTable';
registerLocale("pl", pl);

class TaxPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: false,
            date: new Date().getFullYear()
        };
    }
    filterYear(filter, inputDate) {
        var source = JSON.parse(JSON.stringify(this.props.paneData)); //clone
        var oneYear = source;
        oneYear.transactions = source.transactions.filter((row) => {
            return row.date_transaction.substr(6, 4) == inputDate
        }).filter((row) => {
            return filter ? row.value > 0 : true;
        });
        oneYear.monthView = false;
        oneYear.yearReport = Utils.sumTax(oneYear.transactions);
        oneYear.yearTaxOfficeReport = this.removeJanuary(Utils.sumTax(oneYear.transactions, 7));
        return oneYear;
    }
    prepareData(data) {
        var flatArr = data.transactions.map(x => Object.values(x));
        var flatRules = data.rules.map(x => Object.values(x));
        flatArr.map((el) => {
            el[5] = <LongText text={el[5]} />;
            el[6] = <BadgeButton
                cat={el[6]}
                allCat={data.categories}
                transactionData={el}
                rulesData={flatRules}
            />;
        });
        return flatArr;
    }
    prepareRawData(data) {
        var flatArr = data.map(x => Object.values(x));
        flatArr.map((el) => {
            el[2] = parseFloat(el[2]).toFixed(2);
        });
        return flatArr;
    }
    createTableStructure(data) {
        return {
            data: data,
            title: false,
            headers: ["Id", "Data", "Kwota", "Nadawca", "Odbiorca", "Tytuł", "Kategoria_Transakcji____"],
            rawData: this.prepareRawData(JSON.parse(JSON.stringify(data)).transactions), //clone
            rows: this.prepareData(data)
        };
    }
    removeJanuary(sumTaxArr) { //remove january from transactions sum/array and date array
        sumTaxArr[0] = sumTaxArr[0] - sumTaxArr[1][sumTaxArr[1].length - 1];
        sumTaxArr[1].pop();
        sumTaxArr[2].pop();
        return sumTaxArr;
    }
    render() {
        var data = this.createTableStructure(this.filterYear(
            this.state.filter,
            this.state.date
        ));
        var taxSum = data.data.yearReport;
        var taxOfficeSum = data.data.yearTaxOfficeReport;
        var taxToPay = 0;
        var msg = taxSum[1].length + " transakcji w roku " + this.state.date + ":\n"
        + taxSum[1].join(" + ") + "\n= "
        + Utils.mRound(taxSum[0], 0) + "zł\n\n";
        if (taxSum[0] < 100000) {
            taxToPay = Utils.mRound(taxSum[0] * 0.085);
        }
        else {
            var highTax = (taxSum[0] - 100000) * 0.125;
            taxToPay = Utils.mRound(highTax + 8500);
            msg += "Suma do zapłacenia 8,5% podatku (do 100k): 8500zł\n"
            + "Suma do zapłacenia 12,5% podatku (powyżej 100k): " + Utils.mRound(highTax) + "zł\n";
        }
        msg += "Łącznie suma podatku do zapłacenia: " + taxToPay + "zł\n\n";
        var taxPayed = Utils.mRound(taxOfficeSum[0] * -1, 0);
        msg += taxOfficeSum[1].length + " wpłat do urzędu w roku:\n"
        taxOfficeSum[1].map((val, i) => {
            msg += taxOfficeSum[2][i] + ": " + Utils.replaceAll(val, "-", "") + "zł\n";
        });
        msg += "\nRoczny podatek do zapłacenia: " + taxToPay + "zł\n"
        + "Roczny podatek zapłacony: " + taxPayed + "zł\n"
        + "Ile trzeba zapłacić podatku w styczniu " + (this.state.date+1) + ": " + Utils.mRound(taxToPay - taxPayed, 2) + "zł";
        var yearsArr = [];
        var i = new Date().getFullYear();
        do {
            yearsArr.push(i);
            i -= 1;
        }
        while (i > 2018);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <select
                                type="select"
                                name="year"
                                className="custom-select"
                                onChange={(e) => {
                                    var val = e.currentTarget.value; //because of "This synthetic event is reused..." error
                                    this.setState(
                                        prev => {return {date: parseInt(val)}}
                                    );
                                }}
                            >
                                {yearsArr.map((val, index) => {
                                    return <option key={index} value={val}>{val}</option>
                                })}
                            </select>
                        </div>
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

export default TaxPane;
