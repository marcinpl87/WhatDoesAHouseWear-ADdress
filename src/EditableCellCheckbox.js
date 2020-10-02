import React from 'react';
import ReactDOM from 'react-dom';

const CHAR0 = "☐";
const CHAR1 = "☑";

class EditableCellCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.selectChoice = this.selectChoice.bind(this);
        this.state = {
            html: (!!props.data) ? CHAR1 : CHAR0,
            choicesVisible: false
        };
    }
    selectChoice() {
        this.props.onChange({target: {
            value: (this.state.html == CHAR0) ? 1 : 0
        }});
        this.setState(() => {
            return {
                html: (this.state.html == CHAR0) ? CHAR1 : CHAR0
            }
        });
    }
    render() {
        return <div
            onClick={this.selectChoice}
            style={{cursor: "pointer"}}
        >{this.state.html}</div>
    }
}

export default EditableCellCheckbox;
