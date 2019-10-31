import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

import TabPaneTable from './TabPaneTable';
registerLocale("pl", pl);

class TaxPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: true,
            date: new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 1)
        };
    }
    mRound(num, position = 2) {
        return Number(parseFloat(num).toFixed(position));
    }
    render() {
        var sum = 0;
        var sumArr = [];
        this.props.paneData.data.transactions.map((el) => {
            if (el.category_id == 5) {
                sumArr.push(this.mRound(el.value));
                sum = this.mRound(sum) + this.mRound(el.value);
            }
        });
        var msg = sumArr.length + " transakcji:\n"
        + sumArr.join("zł + ") + "zł = "
        + this.mRound(sum) + "\n\n"
        + this.mRound(sum) + " * 0,125 = "
        + this.mRound(sum*0.125) + " = "
        + this.mRound(sum*0.125, 0 );
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3">
                        <DatePicker
                            dateFormat={"pl"}
                            locale="pl"
                            selected={this.state.date}
                            onChange={date => {
                                this.setState(() => {return {date: date}}, () => {
                                    this.props.paneData.onDateChange(this.state.date, this.state.filter);
                                });
                            }}
                            showMonthYearPicker
                            inline
                        />
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" defaultChecked onChange={() => {
                                this.setState(prev => {return {filter: !prev.filter}}, () => {
                                    this.props.paneData.onDateChange(this.state.date, this.state.filter);
                                });
                            }} />
                            <label className="form-check-label" htmlFor="exampleCheck1">Tylko przychody</label>
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
