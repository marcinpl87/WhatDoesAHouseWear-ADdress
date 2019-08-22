import React from 'react';
import ReactDOM from 'react-dom';
import ContentEditable from 'react-contenteditable';

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {html: this.props.cellVal};
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
            <ContentEditable
                html={this.state.html}
                onChange={this.handleChange}
                tagName='span'
            />
        );
    }
}

export default EditableCell;
