import React from 'react';
import ReactDOM from 'react-dom';
import ButtonDot from './ButtonDot';

class EditableCellSingleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.selectChoice = this.selectChoice.bind(this);
        this.showChoices = this.showChoices.bind(this);
        this.state = {
            html: this.props.selectedVal,
            choicesVisible: false
        };
    }
    showChoices(evt) {
        !this.state.choicesVisible && this.setState((prevState, props) => {
            return {
                choicesVisible: true,
                html: this.props.choices
            }
        });
    }
    selectChoice(val) {
        //todo send this value to parent component
    }
    render() {
        return (
            <React.Fragment>
                {this.state.choicesVisible
                    ? this.state.html.map((v, i) => {
                        return <ButtonDot
                            key={i}
                            buttonName={v[1]}
                            handleClick={() => {this.selectChoice(v[0])}}
                        />
                    })
                    : <span onClick={this.showChoices}>{this.state.html}</span>
                }
            </React.Fragment>
        )
    }
}

export default EditableCellSingleChoice;
