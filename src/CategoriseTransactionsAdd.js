import React from 'react';
import ReactDOM from 'react-dom';

import Utils from './Utils';

class CategoriseTransactionsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction_column: this.props.columnsArr[0][0],
            relation: 1,
            category_id: 1
        }
        this.ruleChange = this.ruleChange.bind(this);
        this.ruleSave = this.ruleSave.bind(this);
    }
    ruleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    ruleSave() {
        event.preventDefault();
        Utils.ajax(
            "post",
            "rules",
            this.state
        ).done((data) => {
            if(data.status) {
                this.props.onNewRow(this.state);
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <select type="select" name="transaction_column" className="custom-select" onChange={this.ruleChange}>
                                    {this.props.columnsArr.map((v, i) => {
                                        return <option key={i} value={v[0]}>{v[1]}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <select type="select" name="relation" className="custom-select" onChange={this.ruleChange}>
                                    <option value="1">==</option>
                                    <option value="2">=&gt;</option>
                                    <option value="3">&gt;</option>
                                    <option value="4">&lt;=</option>
                                    <option value="5">&lt;</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <input name="value" placeholder="wartość" className="form-control" onChange={this.ruleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-block text-right card-footer">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <select type="select" name="category_id" className="custom-select" onChange={this.ruleChange}>
                                    {this.props.catData.map((val, index) => {
                                        return <option key={index} value={val[0]}>{val[1]}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <button className="btn-shadow-primary btn btn-primary btn-lg" onClick={this.ruleSave}>Dodaj</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CategoriseTransactionsAdd;
