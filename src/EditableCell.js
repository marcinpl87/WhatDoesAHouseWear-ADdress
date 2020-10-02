import React from 'react';
import ReactDOM from 'react-dom';
import SanitizeHtml from "sanitize-html";
import ContentEditable from 'react-contenteditable';
import EditableCellCheckbox from './EditableCellCheckbox';
import EditableCellSingleChoice from './EditableCellSingleChoice';
import Utils from './Utils';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.debounce = false;
        this.cellName = this.props.cellConfig[0];
        this.cellOptions = this.props.cellConfig[1];
        this.state = {
            html: Array.isArray(this.cellOptions)
                ? (props.cellData ? Utils.findArrValById(this.cellOptions, props.cellData) : 0)
                : (props.cellData ? props.cellData.toString() : "__________")
        };
    }
    handleChange(evt) {
        var val = SanitizeHtml(evt.target.value, {
            textFilter: (text) => {
                return text.replace(/&quot;/g, '"');
            }
        });
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            $.get("/api.php?r="+this.props.cellTable, {
                id: this.props.cellId,
                field: this.cellName,
                val: val,
                mode: "update",
            }, (data) => {});
        }, 1000);
        this.setState((prevState, props) => {
            return {
                html: evt.target.value
            }
        });
        this.props.cellEditCallback && this.props.cellEditCallback(this.cellName, val);
    }
    render() {
        if (Array.isArray(this.cellOptions)) {
            if (this.cellOptions.length == 1) {
                return <EditableCellCheckbox
                    selectedVal={this.state.html}
                    onChange={this.handleChange}
                />
            }
            else {
                return <EditableCellSingleChoice
                    selectedVal={this.state.html}
                    choices={this.cellOptions}
                    onChange={this.handleChange}
                />
            }
        }
        else {
            return <ContentEditable
                html={this.state.html}
                onChange={this.handleChange}
                tagName='span'
            />
        }
    }
}

export default EditableCell;
