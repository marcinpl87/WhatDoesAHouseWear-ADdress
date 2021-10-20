import React from 'react';
import ReactDOM from 'react-dom';
import Utils from './Utils';
import SanitizeHtml from "sanitize-html";
import ContentEditable from 'react-contenteditable';
import EditableCellDate from './EditableCellDate';
import EditableCellCheckbox from './EditableCellCheckbox';
import EditableCellSingleChoice from './EditableCellSingleChoice';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.debounce = false;
        this.default = "__________";
        this.cellType = this.props.cellConfig[0];
        this.cellName = this.props.cellConfig[1];
        this.cellOptions = this.props.cellConfig[2];
        this.state = { //because of external contenteditable component I need to handle default value
            html: props.cellData ? props.cellData.toString() : this.default
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
            Utils.ajax(
                "post",
                "dynamicUpdate/" + this.props.cellTable,
                {
                    id: this.props.cellId,
                    field: this.cellName,
                    val: val,
                }
            ).done();
        }, 1000);
        this.setState((prevState, props) => {
            return {
                html: evt.target.value || this.default
            }
        });
        this.props.cellEditCallback && this.props.cellEditCallback(this.cellName, val);
    }
    render() {
        if (this.cellType == "text") {
            return <ContentEditable
                html={this.state.html}
                onChange={this.handleChange}
                tagName='span'
            />
        }
        else if (this.cellType == "checkbox") {
            return <EditableCellCheckbox
                data={this.props.cellData}
                onChange={this.handleChange}
            />
        }
        else if (this.cellType == "list") {
            return <EditableCellSingleChoice
                options={this.cellOptions}
                data={this.props.cellData}
                onChange={this.handleChange}
            />
        }
        else if (this.cellType == "date") {
            //I need random key for datepicker to force constructor call for every re-render
            return <EditableCellDate
                key={Math.floor(Math.random() * 999999)}
                html={this.state.html}
                onChange={this.handleChange}
            />
        }
    }
}

export default EditableCell;
