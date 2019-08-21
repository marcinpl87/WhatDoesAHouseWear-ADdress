import React from 'react';
import ReactDOM from 'react-dom';

class TabPane extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={`tab-pane show tabs-animation fade ${this.props.dataActive ? "active" : ""}`} id={this.props.dataId} role="tabpanel">
                <this.props.paneComponent paneData={this.props.paneData} />
            </div>
        )
    }
}

export default TabPane;
