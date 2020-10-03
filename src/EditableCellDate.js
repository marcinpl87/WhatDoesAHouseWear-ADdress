import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";

class EditableCellDate extends React.Component {
    constructor(props) {
        super(props);
        this.selectDate = this.selectDate.bind(this);
        this.showPicker = this.showPicker.bind(this);
        this.state = {
            html: props.html,
            pickerVisible: false
        };
    }
    showPicker(evt) {
        !this.state.pickerVisible && this.setState(() => {
            return {
                pickerVisible: true
            }
        });
    }
    selectDate(val) {
        this.props.onChange({target: {value: val}});
        this.setState(() => {
            return {
                pickerVisible: false,
                html: val
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.pickerVisible
                    ? <React.Fragment>
                        <DatePicker
                            locale="pl"
                            selected={new Date()}
                            onChange={date => {
                                var a = new Date(new Date(date).getTime());
                                this.selectDate(
                                    a.getFullYear()+'-'+
                                    ('0' + (a.getMonth()+1)).slice(-2)
                                    +'-'+('0' + a.getDate()).slice(-2)
                                )
                            }}
                            inline
                        />
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                this.setState(() => {
                                    return {
                                        pickerVisible: false
                                    }
                                });
                            }}
                        >Anuluj zmiany</button>
                        <button
                            className="btn-danger"
                            onClick={() => {this.selectDate("")}}
                        >Usuń datę</button>
                    </React.Fragment>
                    : <span onClick={this.showPicker}>{this.state.html}</span>
                }
            </React.Fragment>
        )
    }
}

export default EditableCellDate;
