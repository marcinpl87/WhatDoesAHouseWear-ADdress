import React from 'react';
import ReactDOM from 'react-dom';

import DropDownDot from './DropDownDot';
import ButtonDot from './ButtonDot';
import Utils from './Utils';

class BadgeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cat: props.cat
        };
        this.updateCat = this.updateCat.bind(this);
    }
    updateCat(cat = 0) {
        Utils.ajax(
            "post",
            "categorise",
            {
                id: this.props.transactionData[0],
                category: cat
            }
        ).done(() => {
            this.setState((prevState, props) => {
                return {
                    cat: cat
                }
            });
        });
    }
    arrayToObject(arr) {
        return arr.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {});
    }
    render() {
        var allCatObj = this.arrayToObject(this.props.allCat);
        var proposedCat = 0;
        if (this.state.cat == 0) {
            this.props.rulesData.map((rule) => {
                if (rule[1] == "2") { //parse to integer only for rules related to money
                    var value = parseInt(this.props.transactionData[rule[1]]);
                    var ruleVal = parseInt(rule[3]);
                }
                else {
                    var value = this.props.transactionData[rule[1]];
                    var ruleVal = rule[3];
                }
                switch(rule[2]) { //relation
                    case "1": // ==
                        if (
                            String(
                                value
                            ).toLowerCase() == String(
                                ruleVal
                            ).toLowerCase()
                        ) {
                            proposedCat = parseInt(rule[4]);
                        }
                    break;
                    case "2": // =>
                        if (value >= ruleVal) {
                            proposedCat = parseInt(rule[4]);
                        }
                    break;
                    case "3": // >
                        if (value > ruleVal) {
                            proposedCat = parseInt(rule[4]);
                        }
                    break;
                    case "4": // <=
                        if (value <= ruleVal) {
                            proposedCat = parseInt(rule[4]);
                        }
                    break;
                    case "5": // <
                        if (value < ruleVal) {
                            proposedCat = parseInt(rule[4]);
                        }
                    break;
                }
            });
        }
        return (
            <React.Fragment>
                {(this.state.cat == 0)
                    ? <DropDownDot
                        transactionId={this.props.transactionData[0]}
                        all={this.props.allCat}
                        allObj={allCatObj}
                        updateCat={this.updateCat}
                        selectedCat={proposedCat} />
                    : <ButtonDot
                        dot={1}
                        handleClick={() => this.updateCat(0)}
                        buttonName={allCatObj[this.state.cat].name}
                        buttonColor={allCatObj[this.state.cat].color} />
                }
            </React.Fragment>
        )
    }
}

export default BadgeButton;
