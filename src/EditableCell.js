import React from 'react';
import ReactDOM from 'react-dom';
import ContentEditable from 'react-contenteditable';
import EditableCellSingleChoice from './EditableCellSingleChoice'

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.findArrValById = this.findArrValById.bind(this);
        this.state = {
            html: Array.isArray(this.props.cellChoices)
                ? (props.cellVal ? this.findArrValById(props.cellChoices, props.cellVal) : 0)
                : (props.cellVal ? props.cellVal.toString() : "__________")
        };
    }
    findArrValById(arr, id) {
        return (arr.filter((value) => {
            return value[0]==id;
        }))[0][1];
    }
    handleChange(evt) {
        $.get("/api.php?r="+this.props.cellTable, {
            id: this.props.cellId,
            field: this.props.cellName,
            val: evt.target.value,
            mode: "update",
        }, (data) => {});
        this.setState((prevState, props) => {
            return {
                html: evt.target.value
            }
        });
    }
    render() {
        return (
            Array.isArray(this.props.cellChoices)
                ? <EditableCellSingleChoice
                    selectedVal={this.state.html}
                    choices={this.props.cellChoices}
                    onChange={this.handleChange}
                />
                : <ContentEditable
                    html={this.state.html}
                    onChange={this.handleChange}
                    tagName='span'
                />
        );
    }
}

export default EditableCell;
