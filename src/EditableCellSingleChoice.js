import React from 'react';
import ReactDOM from 'react-dom';
import ButtonDot from './ButtonDot';
import Utils from './Utils';

class EditableCellSingleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.selectChoice = this.selectChoice.bind(this);
        this.showChoices = this.showChoices.bind(this);
        this.state = {
            html: props.data ? Utils.findArrValById(props.options, props.data) : 0,
            choicesVisible: false
        };
    }
    showChoices(evt) {
        !this.state.choicesVisible && this.setState(() => {
            return {
                choicesVisible: true,
                html: this.props.options
            }
        });
    }
    selectChoice(val) {
        this.props.onChange({target: {value: val[0]}});
        this.setState(() => {
            return {
                choicesVisible: false,
                html: val[1]
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.choicesVisible
                    ? this.state.html.map((v, i) => {
                        return <ButtonDot
                            key={i}
                            buttonName={v[1]}
                            handleClick={() => {this.selectChoice(v)}}
                        />
                    })
                    : <span onClick={this.showChoices}>{this.state.html}</span>
                }
            </React.Fragment>
        )
    }
}

export default EditableCellSingleChoice;
