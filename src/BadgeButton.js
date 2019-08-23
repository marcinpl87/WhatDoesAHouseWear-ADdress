import React from 'react';
import ReactDOM from 'react-dom';

import DropDownDot from './DropDownDot';
import ButtonDot from './ButtonDot';

class BadgeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cat: props.cat
        };
        this.updateCat = this.updateCat.bind(this);
    }
    updateCat(cat) {
        this.setState((prevState, props) => {
            return {
                cat: cat
            }
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
                switch(rule[2]) { //relation
                    case 1: // ==
                        if(this.props.transactionData[rule[1]] == rule[3]) {
                            proposedCat = rule[4];
                        }
                    break;
                    case 2: // =>
                        if(this.props.transactionData[rule[1]] >= rule[3]) {
                            proposedCat = rule[4];
                        }
                    break;
                    case 3: // >
                        if(this.props.transactionData[rule[1]] > rule[3]) {
                            proposedCat = rule[4];
                        }
                    break;
                    case 4: // <=
                        if(this.props.transactionData[rule[1]] <= rule[3]) {
                            proposedCat = rule[4];
                        }
                    break;
                    case 5: // <
                        if(this.props.transactionData[rule[1]] < rule[3]) {
                            proposedCat = rule[4];
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
                        buttonName={allCatObj[this.state.cat].name}
                        buttonColor={allCatObj[this.state.cat].color} />
                }
            </React.Fragment>
        )
    }
}

export default BadgeButton;
