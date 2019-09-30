import React from 'react';
import ReactDOM from 'react-dom';
import SanitizeHtml from "sanitize-html";
import ContentEditable from 'react-contenteditable';
import EditableCellSingleChoice from './EditableCellSingleChoice';
import Utils from './Utils';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            html: Array.isArray(this.props.cellChoices)
                ? (props.cellVal ? Utils.findArrValById(props.cellChoices, props.cellVal) : 0)
                : (props.cellVal ? props.cellVal.toString() : "__________")
        };
    }
    handleChange(evt) {
        var val = SanitizeHtml(evt.target.value);
        $.get("/api.php?r="+this.props.cellTable, {
            id: this.props.cellId,
            field: this.props.cellName,
            val: val,
            mode: "update",
        }, (data) => {});
        this.setState((prevState, props) => {
            return {
                html: val
            }
        });
        this.props.cellEditCallback(this.props.cellName, val);
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
